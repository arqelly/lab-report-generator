from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class FileUploadResponse(BaseModel):
    """Ответ после загрузки файла"""
    filename: str
    columns: List[str]
    numeric_columns: List[str]
    preview: List[Dict[str, Any]]
    shape: List[int]
    message: str = "Файл успешно загружен"

class StatisticsResponse(BaseModel):
    """Статистические показатели"""
    mean: float
    std: float
    min: float
    max: float
    median: float
    q1: float
    q3: float

class PlotRequest(BaseModel):
    """Запрос на построение графика"""
    x_column: str
    y_column: str
    plot_type: str = "line"  # line, scatter, bar, box
    title: Optional[str] = None

class ReportRequest(BaseModel):
    """Запрос на генерацию отчета"""
    title: str
    student_name: str
    group: str
    objective: str
    theory: str
    analysis: str
    conclusions: str
    additional_notes: Optional[str] = None

class ReportResponse(BaseModel):
    """Ответ с путем к сгенерированному отчету"""
    report_path: str
    download_url: str
    message: str = "Отчет успешно сгенерирован"