# Ahaar Backend

Flask API served via Uvicorn (ASGI) with MongoDB (Atlas) and Google Gemini.

## Local Development

- Create `.env` with:
  - GEMINI_API_KEY=...
  - MONGO_URI=...
  - MONGO_DB_NAME=ahaar
  - JWT_SECRET=...
  - UPLOAD_PASSWORD=...

- Install deps:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

- Run (ASGI):

```bash
uvicorn app:asgi_app --reload --host 0.0.0.0 --port 8000
```

- Or Flask dev server (for quick tests):

```bash
python app.py
```

Health check: http://127.0.0.1:8000/api/health

## Deploy on Render

- This repo provides `render.yaml` at the root with a web service configured:
  - rootDir: `backend`
  - build: `pip install -r requirements.txt`
  - start: `uvicorn app:asgi_app --host 0.0.0.0 --port $PORT`
  - healthCheckPath: `/api/health`

- Create a new Web Service in Render by selecting this repo; Render will detect `render.yaml`.
- Set environment variables in the Render dashboard:
  - GEMINI_API_KEY
  - MONGO_URI
  - MONGO_DB_NAME (optional, default `ahaar`)
  - JWT_SECRET
  - UPLOAD_PASSWORD (optional, for legacy uploads)

- After deploy, verify: `GET https://<your-service>.onrender.com/api/health`