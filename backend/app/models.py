from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class FileUploadResponse(BaseModel):
    filename: str = Field(min_length=1)
    columns: List[str]
    numeric_columns: List[str]
    preview: List[Dict[str, Any]]
    shape: List[int] = Field(min_length=2, max_length=2)
    message: str = "Файл успешно загружен"


class StatisticsResponse(BaseModel):
    mean: float
    std: Optional[float] = None
    minimum: float
    maximum: float
    median: float
    q1: float
    q3: float


class PlotRequest(BaseModel):
    x_column: str = Field(min_length=1)
    y_column: str = Field(min_length=1)

    plot_type: Literal[
        "line",
        "scatter",
        "bar",
        "box"
    ] = "line"

    title: Optional[str] = Field(
        default=None,
        max_length=150
    )


class ReportRequest(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    student_name: str = Field(min_length=2, max_length=100)
    group: str = Field(min_length=1, max_length=30)

    objective: str = Field(min_length=1)
    theory: str = Field(min_length=1)
    analysis: str = Field(min_length=1)
    conclusions: str = Field(min_length=1)

    additional_notes: Optional[str] = None


class ReportResponse(BaseModel):
    report_path: str
    download_url: str
    message: str = "Отчёт успешно сгенерирован"
