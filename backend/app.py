from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import google.generativeai as genai
import os
from PIL import Image
import io
import base64
import json
from datetime import datetime, timedelta, timezone
import uuid
import csv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
import gridfs
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

# Load environment variables from .env file FIRST
load_dotenv()

app = Flask(__name__)
# CORS: allow local dev and deployed frontend (Vercel)
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ahaar-beta.vercel.app",
]
CORS(
    app,
    resources={r"/api/*": {"origins": allowed_origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

# In-memory storage for demo (use a database in production)
nutrition_data = {}
user_meals = {}

MEALS_CSV = os.path.join(os.path.dirname(__file__), 'meals.csv')

# Database & Auth configuration
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'ahaar')
JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret')

mongo_client = MongoClient(MONGO_URI) if MONGO_URI else None
db = mongo_client[MONGO_DB_NAME] if mongo_client is not None else None
users_col = db['users'] if db is not None else None
meals_col = db['meals'] if db is not None else None
fs = gridfs.GridFS(db) if db is not None else None

# Ensure indexes
if users_col is not None:
    try:
        users_col.create_index('email', unique=True)
    except Exception as _:
        pass
if meals_col is not None:
    try:
        meals_col.create_index([('user_id', 1), ('timestamp', -1)])
        meals_col.create_index('id', unique=True)
    except Exception as _:
        pass

UPLOAD_PASSWORD = os.getenv('UPLOAD_PASSWORD', 'idk991')

# Setup rate limiter
limiter = Limiter(get_remote_address, app=app)


# -------------------- Auth Helpers --------------------
def create_token(user_id: str, email: str):
    payload = {
        'user_id': str(user_id),
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except Exception:
        return None


def get_auth_user():
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1]
        claims = decode_token(token)
        if claims:
            return claims
    return None

def analyze_food_image(image):
    """Analyze food image using Gemini and extract nutrition information"""
    
    prompt = """
    Analyze this food image and provide detailed nutritional information in JSON format.
    
    Please return the data in this exact structure:
    {
        "food_name": "Name of the food/dish",
        "serving_size": "Estimated serving size",
        "calories": number,
        "macronutrients": {
            "protein": number (in grams),
            "carbs": number (in grams),
            "fat": number (in grams),
            "fiber": number (in grams),
            "sugar": number (in grams)
        },
        "micronutrients": {
            "vitamins": [
                {"name": "Vitamin A", "amount": number, "unit": "μg"},
                {"name": "Vitamin C", "amount": number, "unit": "mg"},
                {"name": "Vitamin D", "amount": number, "unit": "μg"},
                {"name": "Vitamin E", "amount": number, "unit": "mg"},
                {"name": "Vitamin K", "amount": number, "unit": "μg"},
                {"name": "Folate", "amount": number, "unit": "μg"},
                {"name": "B12", "amount": number, "unit": "μg"}
            ],
            "minerals": [
                {"name": "Calcium", "amount": number, "unit": "mg"},
                {"name": "Iron", "amount": number, "unit": "mg"},
                {"name": "Magnesium", "amount": number, "unit": "mg"},
                {"name": "Phosphorus", "amount": number, "unit": "mg"},
                {"name": "Potassium", "amount": number, "unit": "mg"},
                {"name": "Zinc", "amount": number, "unit": "mg"}
            ]
        },
        "other_nutrients": {
            "sodium": number (in mg),
            "cholesterol": number (in mg)
        },
        "confidence": number (0-100, how confident you are in the analysis)
    }
    
    Be as accurate as possible with the nutritional values based on typical serving sizes.
    """
    
    try:
        response = model.generate_content([prompt, image])
        
        # Extract JSON from response
        response_text = response.text
        
        # Find JSON in the response (sometimes it's wrapped in markdown)
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx != -1:
            json_str = response_text[start_idx:end_idx]
            nutrition_info = json.loads(json_str)
            return nutrition_info
        else:
            raise ValueError("No valid JSON found in response")
            
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        # Return default/fallback data
        return {
            "food_name": "Unknown Food",
            "serving_size": "1 serving",
            "calories": 300,
            "macronutrients": {
                "protein": 15,
                "carbs": 30,
                "fat": 10,
                "fiber": 5,
                "sugar": 8
            },
            "micronutrients": {
                "vitamins": [
                    {"name": "Vitamin A", "amount": 100, "unit": "μg"},
                    {"name": "Vitamin C", "amount": 10, "unit": "mg"},
                    {"name": "Vitamin D", "amount": 2, "unit": "μg"},
                    {"name": "Vitamin E", "amount": 1, "unit": "mg"},
                    {"name": "Vitamin K", "amount": 10, "unit": "μg"},
                    {"name": "Folate", "amount": 40, "unit": "μg"},
                    {"name": "B12", "amount": 0.5, "unit": "μg"}
                ],
                "minerals": [
                    {"name": "Calcium", "amount": 100, "unit": "mg"},
                    {"name": "Iron", "amount": 2, "unit": "mg"},
                    {"name": "Magnesium", "amount": 50, "unit": "mg"},
                    {"name": "Phosphorus", "amount": 100, "unit": "mg"},
                    {"name": "Potassium", "amount": 400, "unit": "mg"},
                    {"name": "Zinc", "amount": 1, "unit": "mg"}
                ]
            },
            "other_nutrients": {
                "sodium": 200,
                "cholesterol": 20
            },
            "confidence": 50
        }


# -------------------- Auth Routes --------------------
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    if users_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    name = data.get('name') or ''
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    try:
        hashed = generate_password_hash(password)
        res = users_col.insert_one({
            'email': email,
            'password_hash': hashed,
            'name': name,
            'created_at': datetime.now(timezone.utc)
        })
        user_id = str(res.inserted_id)
        token = create_token(user_id, email)
        return jsonify({'token': token, 'user': {'id': user_id, 'email': email, 'name': name}})
    except DuplicateKeyError:
        return jsonify({'error': 'Email already in use'}), 409


@app.route('/api/auth/login', methods=['POST'])
def login():
    if users_col is None:
        return jsonify({'error': 'Database not configured'}), 500
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    user = users_col.find_one({'email': email})
    if not user or not check_password_hash(user.get('password_hash', ''), password):
        return jsonify({'error': 'Invalid credentials'}), 401
    user_id = str(user['_id'])
    token = create_token(user_id, email)
    return jsonify({'token': token, 'user': {'id': user_id, 'email': email, 'name': user.get('name', '')}})

def read_meals_from_csv():
    meals = []
    if not os.path.exists(MEALS_CSV):
        return meals
    with open(MEALS_CSV, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Parse nutrition JSON
            nutrition = json.loads(row['nutrition_json']) if row.get('nutrition_json') else {}
            meal = {
                'id': row['id'],
                'user_id': row['user_id'],
                'date': row['date'],
                'time': row['time'],
                'name': row['name'],
                'calories': int(row['calories']),
                'nutrition': nutrition,
                'timestamp': row['timestamp']
            }
            meals.append(meal)
    return meals

def append_meal_to_csv(meal):
    file_exists = os.path.exists(MEALS_CSV)
    with open(MEALS_CSV, 'a', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['id', 'user_id', 'date', 'time', 'name', 'calories', 'nutrition_json', 'timestamp']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            'id': meal['id'],
            'user_id': meal['user_id'],
            'date': meal['date'],
            'time': meal['time'],
            'name': meal['name'],
            'calories': meal['calories'],
            'nutrition_json': json.dumps(meal['nutrition']),
            'timestamp': meal['timestamp']
        })

@app.route('/api/upload-meal', methods=['POST'])
@limiter.limit('5 per minute')
def upload_meal():
    """Upload and analyze a meal image (password required)"""
    try:
        claims = get_auth_user()
        password = request.form.get('password') if not claims else None
        if claims is None and password != UPLOAD_PASSWORD:
            return jsonify({'error': 'Unauthorized'}), 401
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        meal_time = request.form.get('meal_time', datetime.now().strftime('%H:%M'))
        date_str = request.form.get('date', datetime.now().strftime('%Y-%m-%d'))
        user_id = (claims.get('user_id') if claims else request.form.get('user_id', 'default_user'))
        # Read file bytes once
        fbytes = file.read()
        image = Image.open(io.BytesIO(fbytes))
        nutrition_info = analyze_food_image(image)
        meal_id = str(uuid.uuid4())
        meal_record = {
            'id': meal_id,
            'user_id': user_id,
            'name': nutrition_info['food_name'],
            'time': meal_time,
            'date': date_str,
            'calories': nutrition_info['calories'],
            'nutrition': nutrition_info,
            'timestamp': datetime.now().isoformat()
        }
        # Store image and meal in Mongo if configured
        if meals_col is not None and fs is not None:
            grid_id = fs.put(
                fbytes,
                filename=file.filename or f"{meal_id}.jpg",
                content_type=file.content_type or 'application/octet-stream'
            )
            meal_doc = dict(meal_record)
            meal_doc['image'] = {
                'file_id': str(grid_id),
                'filename': file.filename,
                'content_type': file.content_type,
                'size': len(fbytes)
            }
            meals_col.insert_one(meal_doc)
        else:
            append_meal_to_csv(meal_record)
        return jsonify({
            'success': True,
            'meal': meal_record,
            'nutrition': nutrition_info
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/nutrition/<user_id>/<period>', methods=['GET'])
def get_nutrition_data(user_id, period):
    """Get aggregated nutrition data for a specific period (MongoDB preferred, CSV fallback)"""
    try:
        date_param = request.args.get('date')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        if not date_param and not (start_date and end_date):
            date_param = datetime.now().strftime('%Y-%m-%d')
        # Calculate date range based on period
        if period == 'daily':
            target_date = datetime.strptime(date_param, '%Y-%m-%d')
            dates_to_include = [target_date.strftime('%Y-%m-%d')]
        elif period == 'weekly':
            if start_date and end_date:
                start = datetime.strptime(start_date, '%Y-%m-%d')
                end = datetime.strptime(end_date, '%Y-%m-%d')
            else:
                target_date = datetime.strptime(date_param, '%Y-%m-%d')
                start = target_date - timedelta(days=target_date.weekday())
                end = start + timedelta(days=6)
            dates_to_include = []
            current = start
            
            # if end_date > :

            while current <= end:
                dates_to_include.append(current.strftime('%Y-%m-%d'))
                current += timedelta(days=1)
        elif period == 'monthly':
            if start_date and end_date:
                start = datetime.strptime(start_date, '%Y-%m-%d')
                end = datetime.strptime(end_date, '%Y-%m-%d')
            else:
                target_date = datetime.strptime(date_param, '%Y-%m-%d')
                start = target_date.replace(day=1)
                if start.month == 12:
                    end = start.replace(year=start.year + 1, month=1) - timedelta(days=1)
                else:
                    end = start.replace(month=start.month + 1) - timedelta(days=1)
            dates_to_include = []
            current = start
            while current <= end:
                dates_to_include.append(current.strftime('%Y-%m-%d'))
                current += timedelta(days=1)
        # Fetch meals from MongoDB or CSV fallback
        meals_src = []
        if meals_col is not None:
            q = {'user_id': user_id, 'date': {'$in': dates_to_include}}
            meals_src = list(meals_col.find(q))
            # Normalize docs
            for m in meals_src:
                m.setdefault('nutrition', {})
        else:
            meals_src = read_meals_from_csv()
        total_nutrition = {
            'calories': 0,
            'protein': 0,
            'carbs': 0,
            'fat': 0,
            'fiber': 0,
            'sugar': 0,
            'sodium': 0,
            'cholesterol': 0,
            'vitamins': {},
            'minerals': {},
            'meals': []
        }
        for meal in meals_src:
            if meal.get('user_id') != user_id:
                continue
            if meal.get('date') not in dates_to_include:
                continue
            nutrition = meal.get('nutrition', {})
            # Add macronutrients
            total_nutrition['calories'] += nutrition.get('calories', 0)
            macro = nutrition.get('macronutrients', {})
            total_nutrition['protein'] += macro.get('protein', 0)
            total_nutrition['carbs'] += macro.get('carbs', 0)
            total_nutrition['fat'] += macro.get('fat', 0)
            total_nutrition['fiber'] += macro.get('fiber', 0)
            total_nutrition['sugar'] += macro.get('sugar', 0)
            # Add other nutrients
            other = nutrition.get('other_nutrients', {})
            total_nutrition['sodium'] += other.get('sodium', 0)
            total_nutrition['cholesterol'] += other.get('cholesterol', 0)
            # Add vitamins
            for vitamin in nutrition.get('micronutrients', {}).get('vitamins', []):
                name = vitamin['name']
                if name not in total_nutrition['vitamins']:
                    total_nutrition['vitamins'][name] = {'amount': 0, 'unit': vitamin['unit']}
                total_nutrition['vitamins'][name]['amount'] += vitamin['amount']
            # Add minerals
            for mineral in nutrition.get('micronutrients', {}).get('minerals', []):
                name = mineral['name']
                if name not in total_nutrition['minerals']:
                    total_nutrition['minerals'][name] = {'amount': 0, 'unit': mineral['unit']}
                total_nutrition['minerals'][name]['amount'] += mineral['amount']
            # Add meal to list
            total_nutrition['meals'].append({
                'id': meal.get('id', ''),
                'name': meal.get('name', ''),
                'time': meal.get('time', ''),
                'calories': meal.get('calories', 0),
                'imageUrl': f"/api/meal-image/{meal.get('id', '')}",
                'nutrition': meal.get('nutrition', {})
            })
        # Convert vitamins and minerals to list format
        vitamins_list = [{'name': name, 'amount': data['amount'], 'unit': data['unit']} 
                        for name, data in total_nutrition['vitamins'].items()]
        minerals_list = [{'name': name, 'amount': data['amount'], 'unit': data['unit']} 
                        for name, data in total_nutrition['minerals'].items()]
        result = {
            'calories': total_nutrition['calories'],
            'protein': total_nutrition['protein'],
            'carbs': total_nutrition['carbs'],
            'fat': total_nutrition['fat'],
            'fiber': total_nutrition['fiber'],
            'sugar': total_nutrition['sugar'],
            'sodium': total_nutrition['sodium'],
            'cholesterol': total_nutrition['cholesterol'],
            'vitamins': vitamins_list,
            'minerals': minerals_list,
            'meals': total_nutrition['meals']
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/meals/<user_id>', methods=['GET'])
def get_user_meals(user_id):
    """Get all meals for a user (MongoDB preferred, CSV fallback)"""
    try:
        date_param = request.args.get('date')
        meals = []
        if meals_col is not None:
            q = {'user_id': user_id}
            if date_param:
                q['date'] = date_param
            meals = list(meals_col.find(q))
        else:
            all_meals = read_meals_from_csv()
            meals = [m for m in all_meals if m['user_id'] == user_id]
            if date_param:
                meals = [m for m in meals if m['date'] == date_param]
        meals.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        # Ensure JSON serializable
        normalized = []
        for m in meals:
            normalized.append({
                'id': m.get('id', ''),
                'user_id': m.get('user_id', ''),
                'date': m.get('date', ''),
                'time': m.get('time', ''),
                'name': m.get('name', ''),
                'calories': int(m.get('calories', 0)),
                'nutrition': m.get('nutrition', {}),
                'timestamp': m.get('timestamp', '')
            })
        return jsonify({'meals': normalized})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/meal-image/<meal_id>', methods=['GET'])
def get_meal_image(meal_id):
    """Return the image bytes for a meal if stored in GridFS."""
    try:
        if meals_col is None or fs is None:
            return jsonify({'error': 'Image storage not configured'}), 404
        meal = meals_col.find_one({'id': meal_id})
        if not meal:
            return jsonify({'error': 'Meal not found'}), 404
        image_info = meal.get('image') or {}
        file_id = image_info.get('file_id')
        if not file_id:
            return jsonify({'error': 'Image not found'}), 404
        gridout = fs.get(ObjectId(file_id))
        data = gridout.read()
        return send_file(io.BytesIO(data), mimetype=image_info.get('content_type') or 'application/octet-stream')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
    'gemini_configured': bool(os.getenv('GEMINI_API_KEY')),
    'db_connected': db is not None
    })

@app.route('/api/test', methods=['POST'])
def test_endpoint():
    """Test endpoint for CORS"""
    return jsonify({'message': 'CORS is working', 'method': 'POST'})

# ASGI adapter for uvicorn
try:
    from asgiref.wsgi import WsgiToAsgi
    # Create ASGI app for uvicorn
    asgi_app = WsgiToAsgi(app)
except ImportError:
    # Fallback if asgiref is not installed
    asgi_app = None

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)