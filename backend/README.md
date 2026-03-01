# Backend - My Tech Site

FastAPI + PostgreSQL + SQLAlchemy Async

## 启动

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Seed 数据

```bash
cd backend
python seed.py
```

## API 文档

启动后访问 http://localhost:8000/docs
