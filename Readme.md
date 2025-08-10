# Ahaar — AI‑Powered Nutrition & Diet Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Ahaar helps users understand meals from photos and track daily, weekly, and monthly nutrition. It powers both a consumer app and a simple REST API for developers.

## Demo
- Watch: https://raw.githubusercontent.com/isatyamks/Ahaar_App/main/video/data.mp4
- File in repo: `video/data.mp4`

## Features
- Food recognition from images, with macro/micro nutrients
- Advanced insights: GI/GL, fats profile, antioxidants, allergens, footprint
- Trends and dashboards (daily/weekly/monthly)
- Secure auth (JWT); meals and media stored in MongoDB + GridFS
- REST API for uploads and aggregates

## Architecture
- Android (Kotlin)
- Web: React + Vite + TypeScript + Tailwind
- Backend: Flask (ASGI via Uvicorn)
- DB: MongoDB Atlas + GridFS
- AI: Gemini 1.5 (google‑generativeai)
- Hosting: Render (backend), Vercel/static (frontend)

## Quick start
Backend (Windows cmd):
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set GEMINI_API_KEY=... & set JWT_SECRET=... & set MONGO_URI=...
uvicorn app:asgi_app --host 0.0.0.0 --port 8000
```

Frontend:
```
cd frontend
npm install
set VITE_API_BASE_URL=https://ahaar-app.onrender.com/api
npm run dev
```

Android: open `Android/` in Android Studio and run on a device/emulator.

## API (summary)
Base URL: `https://ahaar-app.onrender.com/api`

- POST `/auth/signup`, `/auth/login` → JWT
- POST `/upload-meal` (multipart: `image`, `user_id`)
- GET `/nutrition/{user_id}/{period}` (period: daily|weekly|monthly; query: `date` or `start_date`/`end_date`)
- GET `/meals/{user_id}`
- GET `/meal-image/{meal_id}`
- GET `/health` (service status)

## Security
- JWT Bearer auth; short‑lived tokens
- CORS locked to trusted origins
- Images stored privately via GridFS

## Links
- Frontend: `/frontend`
- Backend: `/backend`
- Issues: https://github.com/isatyamks/Ahaar_App/issues

## License
MIT © Team Sapiens

