from pathlib import Path
import time
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from .models import (
    FileUploadResponse,
    PlotRequest,
    ReportRequest,
    ReportResponse
)
from .processor import processor


UPLOAD_DIR = Path("uploads")# Тася, это штука создаёт папку, её отсюда никуда не убирать, а то первый отчёт не сохранится
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".txt"}


app = FastAPI(
    title="Конструктор инфографики",
    description="Сервис для обработки экспериментальных данных и создания отчётов",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {
        "message": "Конструктор инфографики работает",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Не указано имя файла"
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))

        raise HTTPException(
            status_code=400,
            detail=f"Неподдерживаемый формат файла. Разрешены: {allowed}"
        )

    try:
        data = await processor.load_file(file)
        columns_info = processor.get_columns_info()

        return FileUploadResponse(
            filename=file.filename,
            columns=columns_info["columns"],
            numeric_columns=columns_info["numeric_columns"],
            preview=processor.get_preview(),
            shape=[data.shape[0], data.shape[1]]
        )

    except HTTPException:
        raise

    except (ValueError, UnicodeDecodeError) as error:
        raise HTTPException(
            status_code=400,
            detail=f"Не удалось прочитать файл: {error}"
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обработке файла: {error}"
        )


@app.get("/api/statistics")
async def get_statistics():
    try:
        statistics = processor.calculate_statistics()

        if not statistics:
            raise HTTPException(
                status_code=400,
                detail="В файле нет числовых столбцов"
            )

        return statistics

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Не удалось рассчитать статистику: {error}"
        )


@app.post("/api/plot")
async def create_plot(plot_request: PlotRequest):
    try:
        return processor.create_plot(
            x_col=plot_request.x_column,
            y_col=plot_request.y_column,
            plot_type=plot_request.plot_type
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Не удалось построить график: {error}"
        )


@app.post("/api/generate-report", response_model=ReportResponse)
async def generate_report(
    report_request: ReportRequest,
    background_tasks: BackgroundTasks
):
    try:
        report_data = report_request.model_dump()

        report_path = Path(
            processor.generate_report_word(report_data)
        )

        background_tasks.add_task(cleanup_old_files, 7)

        return ReportResponse(
            report_path=str(report_path),
            download_url=f"/api/download/{report_path.name}",
            message="Отчёт успешно создан"
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Не удалось создать отчёт: {error}"
        )


@app.get("/api/download/{filename}")
async def download_report(filename: str):
    safe_filename = Path(filename).name

    if safe_filename != filename:
        raise HTTPException(
            status_code=400,
            detail="Некорректное имя файла"
        )
    # в адрессе должно быть только имя отчёта, если в имени вылезут какие то пути или что то такое, то ошибки будут
    file_path = UPLOAD_DIR / safe_filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Отчёт не найден"
        )

    return FileResponse(
        path=file_path,
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        ),
        filename=safe_filename
    )


def cleanup_old_files(days: int = 7):
    oldest_allowed_time = time.time() - days * 24 * 60 * 60

    for file_path in UPLOAD_DIR.iterdir():
        try:
            if (
                file_path.is_file()
                and file_path.stat().st_mtime < oldest_allowed_time
            ):
                file_path.unlink()
        except OSError:
            # я вот это добавила чтобы одна ошибка всё не руинила
            continue
