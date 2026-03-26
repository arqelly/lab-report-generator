# Конструктор инфографики для лабораторных работ

Веб-сервис для автоматической генерации отчетов по лабораторным работам. Загрузите данные в CSV/Excel и получите готовый PDF-отчет с графиками.

## 🚀 Функциональность

- Загрузка данных (CSV, Excel, TXT)
- Автоматическое построение графиков (линейные, столбчатые, точечные)
- Расчет статистических показателей
- Генерация PDF/Word отчетов
- Современный интерфейс

## 🛠 Технологии

- **Backend:** FastAPI, Python
- **Frontend:** React, TypeScript, Material UI
- **Графики:** Plotly, Matplotlib
- **Отчеты:** python-docx

## 📦 Установка и запуск

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev