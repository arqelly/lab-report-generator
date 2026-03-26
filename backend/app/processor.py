import pandas as pd
import numpy as np
import io
import plotly.express as px
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder
import json
from typing import Dict, Any, List, Optional
import aiofiles
from fastapi import UploadFile
from datetime import datetime

class DataProcessor:
    """Класс для обработки экспериментальных данных"""
    
    def __init__(self):
        self.data: Optional[pd.DataFrame] = None
        self.filename: Optional[str] = None
        
    async def load_file(self, file: UploadFile) -> pd.DataFrame:
        """Загрузка файла с данными"""
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            self.data = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xlsx', '.xls')):
            self.data = pd.read_excel(io.BytesIO(content))
        elif file.filename.endswith('.txt'):
            self.data = pd.read_csv(io.BytesIO(content), delimiter='\t')
        else:
            raise ValueError(f"Неподдерживаемый формат файла: {file.filename}")
        
        self.filename = file.filename
        return self.data
    
    def get_preview(self, n_rows: int = 10) -> List[Dict[str, Any]]:
        """Получение предпросмотра данных"""
        if self.data is None:
            return []
        return self.data.head(n_rows).to_dict(orient='records')
    
    def get_columns_info(self) -> Dict[str, Any]:
        """Информация о колонках"""
        if self.data is None:
            return {"columns": [], "numeric_columns": []}
        
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        return {
            "columns": self.data.columns.tolist(),
            "numeric_columns": numeric_cols
        }
    
    def calculate_statistics(self) -> Dict[str, Dict[str, float]]:
        """Расчет статистических показателей для всех числовых колонок"""
        if self.data is None:
            return {}
        
        stats = {}
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            col_data = self.data[col].dropna()
            stats[col] = {
                "mean": float(col_data.mean()),
                "std": float(col_data.std()),
                "min": float(col_data.min()),
                "max": float(col_data.max()),
                "median": float(col_data.median()),
                "q1": float(col_data.quantile(0.25)),
                "q3": float(col_data.quantile(0.75))
            }
        
        return stats
    
    def create_plot(self, x_col: str, y_col: str, 
                   plot_type: str = "line") -> Dict[str, Any]:
        """Создание интерактивного графика с Plotly"""
        if self.data is None:
            return {}
        
        # Определяем тип графика
        if plot_type == "line":
            fig = px.line(self.data, x=x_col, y=y_col, 
                         title=f"Зависимость {y_col} от {x_col}")
        elif plot_type == "scatter":
            fig = px.scatter(self.data, x=x_col, y=y_col,
                           title=f"Диаграмма рассеяния {y_col} от {x_col}")
        elif plot_type == "bar":
            fig = px.bar(self.data, x=x_col, y=y_col,
                        title=f"Столбчатая диаграмма {y_col} от {x_col}")
        elif plot_type == "box":
            fig = px.box(self.data, y=y_col,
                        title=f"Ящик с усами для {y_col}")
        else:
            fig = px.line(self.data, x=x_col, y=y_col)
        
        # Настройка внешнего вида
        fig.update_layout(
            template="plotly_white",
            xaxis_title=x_col,
            yaxis_title=y_col,
            hovermode="closest"
        )
        
        # Конвертация в JSON для передачи на фронтенд
        return json.loads(json.dumps(fig, cls=PlotlyJSONEncoder))
    
    def generate_report_word(self, report_data: Dict[str, Any]) -> str:
        """Генерация отчета в формате Word"""
        from docx import Document
        from docx.shared import Inches, Pt
        from docx.enum.text import WD_ALIGN_PARAGRAPH
        import matplotlib.pyplot as plt
        import io
        
        doc = Document()
        
        # Заголовок
        title = doc.add_heading(f'Лабораторная работа: {report_data["title"]}', 0)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        # Информация о студенте
        doc.add_heading('Информация о студенте', level=1)
        doc.add_paragraph(f"ФИО: {report_data['student_name']}")
        doc.add_paragraph(f"Группа: {report_data['group']}")
        doc.add_paragraph(f"Дата: {datetime.now().strftime('%d.%m.%Y')}")
        
        # Цель работы
        doc.add_heading('Цель работы', level=1)
        doc.add_paragraph(report_data['objective'])
        
        # Теоретическая часть
        doc.add_heading('Теоретическая часть', level=1)
        doc.add_paragraph(report_data['theory'])
        
        # Экспериментальные данные
        if self.data is not None:
            doc.add_heading('Экспериментальные данные', level=1)
            
            # Создаем таблицу
            table = doc.add_table(rows=1, cols=len(self.data.columns))
            table.style = 'Light Grid Accent 1'
            
            # Заголовки
            header_cells = table.rows[0].cells
            for i, col in enumerate(self.data.columns):
                header_cells[i].text = str(col)
            
            # Данные (первые 20 строк)
            for _, row in self.data.head(20).iterrows():
                row_cells = table.add_row().cells
                for i, value in enumerate(row):
                    if isinstance(value, (int, float)):
                        row_cells[i].text = f"{value:.3f}"
                    else:
                        row_cells[i].text = str(value)
            
            doc.add_paragraph(f"*Показаны первые 20 строк из {len(self.data)}*")
        
        # Графики
        doc.add_heading('Графики', level=1)
        
        # Создаем matplotlib графики для Word
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) >= 2:
            plt.figure(figsize=(8, 5))
            plt.plot(self.data[numeric_cols[0]], 
                    self.data[numeric_cols[1]], 'b-o', linewidth=2)
            plt.xlabel(numeric_cols[0])
            plt.ylabel(numeric_cols[1])
            plt.title(f"График зависимости {numeric_cols[1]} от {numeric_cols[0]}")
            plt.grid(True, alpha=0.3)
            
            # Сохраняем в буфер и вставляем в документ
            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
            img_buffer.seek(0)
            doc.add_picture(img_buffer, width=Inches(6))
            plt.close()
        
        # Анализ результатов
        doc.add_heading('Анализ результатов', level=1)
        doc.add_paragraph(report_data['analysis'])
        
        # Выводы
        doc.add_heading('Выводы', level=1)
        doc.add_paragraph(report_data['conclusions'])
        
        # Сохраняем отчет
        filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
        filepath = f"uploads/{filename}"
        doc.save(filepath)
        
        return filepath

# Создаем глобальный экземпляр процессора
processor = DataProcessor()