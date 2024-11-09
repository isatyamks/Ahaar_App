from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure the generative AI API
api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=api_key)

# Define the function to get a response from the Gemini model
def get_gemini_response(input_prompt, image):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input_prompt, image[0]])
    return response.text

# Setup function for input image in memory
def input_image_setup(file):
    bytes_data = file.read()
    image_parts = [
        {
            "mime_type": "image/jpeg",
            "data": bytes_data
        }
    ]
    return image_parts

# Define allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        input_prompt = """
        Please present the information in the following format just remember don't write anything beyond { }:

        {
            "Detected Food Items": [
            {
                "name": "Item 1",
                "quantity": "[quantity]",
                "calories": "[calories] kcal",
                "protein": "[protein] g",
                "carbs": "[carbs] g",
                "fiber": "[fiber] g",
                "fats": "[fats] g",
                "water_content": "[water_content] ml",
                "sugar": "[sugar] g",
                "sodium": "[sodium] mg",
                "cholesterol": "[cholesterol] mg",
                "potassium": "[potassium] mg",
                "vitamin_c": "[vitamin_c] mg",
                "vitamin_a": "[vitamin_a] IU",
                "calcium": "[calcium] mg",
                "iron": "[iron] mg"
            },
            {
                "name": "Item 2",
                "quantity": "[quantity]",
                "calories": "[calories] kcal",
                "protein": "[protein] g",
                "carbs": "[carbs] g",
                "fiber": "[fiber] g",
                "fats": "[fats] g",
                "water_content": "[water_content] ml",
                "sugar": "[sugar] g",
                "sodium": "[sodium] mg",
                "cholesterol": "[cholesterol] mg",
                "potassium": "[potassium] mg",
                "vitamin_c": "[vitamin_c] mg",
                "vitamin_a": "[vitamin_a] IU",
                "calcium": "[calcium] mg",
                "iron": "[iron] mg"
            },
            {
                "name": "Item 3",
                "quantity": "[quantity]",
                "calories": "[calories] kcal",
                "protein": "[protein] g",
                "carbs": "[carbs] g",
                "fiber": "[fiber] g",
                "fats": "[fats] g",
                "water_content": "[water_content] ml",
                "sugar": "[sugar] g",
                "sodium": "[sodium] mg",
                "cholesterol": "[cholesterol] mg",
                "potassium": "[potassium] mg",
                "vitamin_c": "[vitamin_c] mg",
                "vitamin_a": "[vitamin_a] IU",
                "calcium": "[calcium] mg",
                "iron": "[iron] mg"
            }
            // Continue for additional unique items
            ]
        }
        """


        image_data = input_image_setup(file)
        response = get_gemini_response(input_prompt, image_data)
        print(response)
        return jsonify({'message': response}), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400

if __name__ == '__main__':
    app.run(debug=True)
