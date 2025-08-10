# Ahaar - AI-Powered Nutrition and Diet Tracking App

**Hackathon - HackCBS 7.0**

## 👥 Team Sapiens

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Ahaar is an intelligent Android + Web application designed to enhance nutrition tracking by detecting foods in real-time, analyzing nutritional values, and helping users maintain a balanced diet. Powered by machine learning, Ahaar identifies food items on a plate, tracks nutritional intake (calories, fats, proteins, etc.) daily, weekly, and monthly, and provides personalized diet recommendations to meet individual health goals.

---

## 📹 Demo Video

- YouTube: https://youtu.be/VIDEO_ID_HERE
- Google Drive (fallback): https://drive.google.com/file/d/DRIVE_FILE_ID/view
- GitHub Release (MP4): https://github.com/OWNER/REPO/releases/latest/download/ahaar-demo.mp4

Preview thumbnail (YouTube):

[![Watch the demo](https://img.youtube.com/vi/VIDEO_ID_HERE/hqdefault.jpg)](https://youtu.be/VIDEO_ID_HERE)

Tip: Replace the placeholders above with your actual video links. GitHub also renders direct .mp4 links inline if you prefer hosting the file in Releases or GitHub Assets.

---

## 🚧 Mobile App (Coming Soon)

We’re polishing the full mobile experience. Until then, here’s a working preview of the app:

- YouTube (preview): https://youtu.be/MOBILE_VIDEO_ID
- Google Drive (preview): https://drive.google.com/file/d/MOBILE_DRIVE_FILE_ID/view
- GitHub Release (MP4 preview): https://github.com/OWNER/REPO/releases/latest/download/ahaar-mobile-preview.mp4

You can embed a thumbnail too:

[![Mobile app preview](https://img.youtube.com/vi/MOBILE_VIDEO_ID/hqdefault.jpg)](https://youtu.be/MOBILE_VIDEO_ID)

---

##  Features

- Food Detection and Image Upload (Android + Web)
- Nutritional Analysis (calories, macro/micro nutrients)
- Progress Tracking (daily, weekly, monthly)
- Personalized Diet Suggestions
- Advanced Insights (GI/GL, ORAC, fats breakdown, allergens, activity match, footprint)
- User Auth (JWT), meals history, and charts

---

## Why We Created Ahaar

In India, lifestyle diseases such as diabetes, obesity, and heart disease are rising at an alarming rate. Nearly **8-10% of the population** is affected by diabetes, and **40% are overweight**. These aren’t just numbers; they represent our family members, friends, and neighbors facing serious health challenges every day.

### The Mission Behind Ahaar

We created **Ahaar** to empower individuals to take control of their nutrition and, ultimately, their health. Our goal is to simplify meal tracking, making it accessible and insightful for every user. By providing instant nutritional information and personalized recommendations, Ahaar goes beyond calorie counting to guide users in building healthier habits. It bridges the knowledge gap many Indians have about nutrition, especially when it comes to traditional Indian foods.

### Why Ahaar is Important for India

- Addresses rising lifestyle diseases with practical nutrition guidance
- Culturally relevant for Indian diets (roti, dal, samosa, etc.)
- Bridges the nutrition knowledge gap with instant, clear info
- Saves time with simple logging and automated analysis



### The Vision

With **Ahaar**, we aim to reduce lifestyle diseases by promoting awareness and supporting healthier eating choices for millions of Indians. Whether in urban centers or rural areas, Ahaar makes nutrition tracking easy, accessible, and impactful, enabling everyone to build healthier habits for a better future.


## 🎯 Purpose

Ahaar aims to make nutrition tracking simpler, more accurate, and goal-oriented by leveraging artificial intelligence. It empowers users to make informed dietary decisions, ultimately supporting a healthier lifestyle.


## 💡 How It Works

1. **Food Detection**: Ahaar uses a machine learning model to identify foods from images captured by the device's camera.
2. **Nutritional Calculation**: Once detected, Ahaar calculates the nutritional values of each food item, including macronutrients (carbs, proteins, fats) and micronutrients (vitamins, minerals).
3. **Goal Tracking**: Users can set dietary goals, and Ahaar will track progress across different time periods.
4. **Diet Recommendations**: Based on the user's current intake and goals, Ahaar suggests food choices and modifications to optimize their diet.

---

## 🚀 Tech Stack

- Android (Kotlin)
- Web: React + Vite + TypeScript + Tailwind CSS
- Backend: Flask (ASGI via Uvicorn), CORS, JWT
- DB: MongoDB Atlas + GridFS
- AI: Gemini 1.5 (google-generativeai)
- Deployment: Render (backend), Vercel/static (frontend)

---

## 📈 Key Metrics

- Caloric Intake (per period)
- Macronutrient Breakdown (protein/carbs/fat)
- Micronutrients (vitamins, minerals)
- Trends (sparklines for recent meals)

---

## 🛠️ Installation and Setup

1. Clone the Repository
    ```bash
    git clone https://github.com/your-username/ahaar.git
    ```
2. Backend (Flask + ASGI)
    - Path: `backend/`
    - Create `.env` with:
       - `GEMINI_API_KEY=...`
       - `JWT_SECRET=...`
       - `MONGO_URI=...`
    - Run (Windows cmd):
       ```bat
       cd backend
       python -m venv .venv
       .venv\Scripts\activate
       pip install -r requirements.txt
       uvicorn app:asgi_app --host 0.0.0.0 --port 8000
       ```
    - Health: http://127.0.0.1:8000/api/health
3. Frontend (Vite + React)
    - Path: `frontend/`
    - Create `.env` with:
       - `VITE_API_BASE_URL=https://ahaar-app.onrender.com/api`
    - Run:
       ```bat
       cd frontend
       npm install
       npm run dev
       ```
4. Android App
    - Open `Android/` in Android Studio and run on a device/emulator.

---

## 🌐 Deployment

### Backend (Render)
- Uses `backend/render.yaml`, `backend/Procfile`, `backend/runtime.txt` (Python 3.11.9)
- Start: `uvicorn app:asgi_app`
- Health: `/api/health`
- Env vars: `GEMINI_API_KEY`, `MONGO_URI`, `JWT_SECRET`, `PYTHON_VERSION=3.11.9`

### Frontend (Vercel or static hosting)
- Set env `VITE_API_BASE_URL`
- Build: `npm run build` → deploy `dist/`

---

## 🔐 Authentication
- Email/password signup and login (JWT)
- JWT stored in localStorage; sent via `Authorization: Bearer <token>`
- Legacy upload password retained for non-auth dev flows

---

## 🧠 Advanced Insights (AI)
- GI/GL, amino acids, fatty acids (Ω3/Ω6, sat/mono/poly)
- Antioxidants (ORAC), diet compat, allergens, deficiency/excess alerts
- Workout equivalence + burn-time; environmental footprint (CO₂, water, sourcing)
- Historical AI suggestions
- UI: health gauge, ORAC bar, fat bars, and trends (calories/protein)

---

## 🧪 Quick API Test
```bash
curl -s https://ahaar-app.onrender.com/api/health
```

---

## 📄 License
MIT © Team Sapiens

