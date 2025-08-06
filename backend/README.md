# Nutrition Tracking Backend

Flask backend that integrates with Google's Gemini API to analyze food images and extract detailed nutrition information.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

3. Get a Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

4. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/upload-meal
Upload and analyze a meal image.

**Form Data:**
- `image`: Image file
- `meal_time`: Time of meal (optional, defaults to current time)
- `date`: Date of meal (optional, defaults to current date)
- `user_id`: User identifier (optional, defaults to 'default_user')

**Response:**
```json
{
  "success": true,
  "meal": {
    "id": "meal_id",
    "name": "Food Name",
    "time": "12:30",
    "date": "2024-01-15",
    "calories": 420,
    "nutrition": { ... }
  },
  "nutrition": { ... }
}
```

### GET /api/nutrition/{user_id}/{period}
Get aggregated nutrition data for a specific period.

**Parameters:**
- `user_id`: User identifier
- `period`: 'daily', 'weekly', or 'monthly'

**Query Parameters:**
- `date`: Specific date (for daily) or reference date (for weekly/monthly)
- `start_date` & `end_date`: Custom date range

**Response:**
```json
{
  "calories": 1650,
  "protein": 125,
  "carbs": 180,
  "fat": 58,
  "fiber": 25,
  "sugar": 45,
  "sodium": 1200,
  "cholesterol": 180,
  "vitamins": [...],
  "minerals": [...],
  "meals": [...]
}
```

### GET /api/meals/{user_id}
Get all meals for a user.

**Query Parameters:**
- `date`: Filter by specific date (optional)

### GET /api/health
Health check endpoint to verify the server is running and Gemini is configured.

## Features

- **Image Analysis**: Uses Google's Gemini 1.5 Flash model to analyze food images
- **Detailed Nutrition**: Extracts calories, macronutrients, vitamins, minerals, and other nutrients
- **Data Aggregation**: Supports daily, weekly, and monthly nutrition summaries
- **Date Range Support**: Flexible date selection for custom periods
- **CORS Enabled**: Ready for frontend integration
- **Error Handling**: Graceful fallbacks when API calls fail

## Integration with Frontend

The backend is designed to work seamlessly with the React nutrition dashboard. Update your frontend to call these endpoints instead of using mock data.