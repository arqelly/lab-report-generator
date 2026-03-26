from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
import os
import shutil
from datetime import datetime

from .models import (
    FileUploadResponse, StatisticsResponse, PlotRequest,
    ReportRequest, ReportResponse
)
from .processor import processor

# Создание приложения
app = FastAPI(
    title="Lab Report Generator API",
    description="API для автоматической генерации отчетов по лабораторным работам",
    version="1.0.0"
)

# Настройка CORS [citation:6][citation:9]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание директории для загрузок
os.makedirs("uploads", exist_ok=True)

# Монтирование статических файлов (для доступа к сгенерированным отчетам)
app.mount("/reports", StaticFiles(directory="uploads"), name="reports")

@app.get("/")
async def root():
    """Корневой эндпоинт для проверки работы API"""
    return {
        "message": "Lab Report Generator API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Загрузка файла с экспериментальными данными.
    
    Поддерживаемые форматы: CSV, Excel (xlsx, xls), TXT
    """
    try:
        # Проверка расширения файла
        allowed_extensions = ['.csv', '.xlsx', '.xls', '.txt']
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Неподдерживаемый формат файла. Разрешены: {', '.join(allowed_extensions)}"
            )
        
        # Загрузка данных
        data = await processor.load_file(file)
        
        # Получение информации
        columns_info = processor.get_columns_info()
        preview = processor.get_preview()
        
        return FileUploadResponse(
            filename=file.filename,
            columns=columns_info["columns"],
            numeric_columns=columns_info["numeric_columns"],
            preview=preview,
            shape=[data.shape[0], data.shape[1]]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/statistics")
async def get_statistics():
    """Получение статистических показателей для всех числовых колонок"""
    try:
        stats = processor.calculate_statistics()
        if not stats:
            raise HTTPException(
                status_code=400,
                detail="Нет загруженных данных или отсутствуют числовые колонки"
            )
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/plot")
async def create_plot(plot_request: PlotRequest):
    """Создание интерактивного графика"""
    try:
        plot_data = processor.create_plot(
            x_col=plot_request.x_column,
            y_col=plot_request.y_column,
            plot_type=plot_request.plot_type
        )
        return plot_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-report", response_model=ReportResponse)
async def generate_report(
    report_request: ReportRequest,
    background_tasks: BackgroundTasks
):
    """Генерация отчета в формате Word"""
    try:
        # Генерация отчета
        report_path = processor.generate_report_word(report_request.dict())
        
        # Получение имени файла
        filename = os.path.basename(report_path)
        
        # Фоновая задача: удаление старых файлов (опционально)
        background_tasks.add_task(cleanup_old_files, days=7)
        
        return ReportResponse(
            report_path=report_path,
            download_url=f"/reports/{filename}",
            message="Отчет успешно сгенерирован"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{filename}")
async def download_report(filename: str):
    """Скачивание сгенерированного отчета"""
    file_path = f"uploads/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=filename
    )

def cleanup_old_files(days: int = 7):
    """Удаление файлов старше указанного количества дней"""
    import time
    now = time.time()
    
    for filename in os.listdir("uploads"):
        filepath = os.path.join("uploads", filename)
        if os.path.isfile(filepath):
            # Если файл старше days дней
            if os.stat(filepath).st_mtime < now - days * 86400:
                os.remove(filepath)

# Запуск сервера (для разработки)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)