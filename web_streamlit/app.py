from dotenv import load_dotenv
import streamlit as st
import os
import google.generativeai as genai
from PIL import Image

load_dotenv()

api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=api_key)

def get_gemini_response(input_prompt, image):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input_prompt, image[0]])
    return response.text

def input_image_setup(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()
        image_parts = [
            {
                "mime_type": uploaded_file.type,
                "data": bytes_data
            }
        ]
        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")

st.set_page_config(page_title="Ahaar", page_icon="🍲", layout="centered")

st.markdown("""
    <style>
     
        body {
            background-color: #f3f4f6;
            color: #333;
        }

       
        .header h1 {
            color: #2E86C1;
            font-size: 3em;
            margin-bottom: 0.1em;
            text-align: center;
            font-family: 'Roboto', sans-serif;
        }

        .stTextInput, .stFileUploader, .stButton, .stWarning {
            font-family: 'Roboto', sans-serif;
            color: #333;
            border-radius: 8px;
        }

       
        .stButton button {
            background-color: #2E86C1;
            color: white;
            padding: 0.5em 1.5em;
            font-size: 1em;
            border-radius: 8px;
        }

       
        .stWarning {
            color: #FF5733;
            font-size: 0.9em;
        }

        
        .response {
            font-family: 'Roboto', sans-serif;
            color: #2E4053;
            font-size: 1.2em;
            margin-top: 0.5em;
            background-color: #E8F8F5;
            padding: 1em;
            border-radius: 10px;
        }
    </style>
""", unsafe_allow_html=True)

st.markdown('<div class="header"><h1>Ahaar</h1></div>', unsafe_allow_html=True)
st.write("Upload a picture of your food")

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

submit = st.button("Analyze the Picture")

input_prompt = """
You are a nutrition expert. Your task is to analyze the food items in the uploaded image, 
calculate the total calorie content, and provide detailed nutritional information for each unique food item. 
For each food item, present the nutritional values on separate lines. If the same food item appears more than once, 
do not repeat the information, but instead indicate the quantity in the following format:

Detected Food Items:
- name: "Item 1"
- quantity: "[quantity]"
- calories: "[calories] kcal"
- protein: "[protein] g"
- carbs: "[carbs] g"
- fiber: "[fiber] g"
- fats: "[fats] g"
- water_content: "[water_content] ml"
- sugar: "[sugar] g"
- sodium: "[sodium] mg"
- cholesterol: "[cholesterol] mg"
- potassium: "[potassium] mg"
- vitamin_c: "[vitamin_c] mg"
- vitamin_a: "[vitamin_a] IU"
- calcium: "[calcium] mg"
- iron: "[iron] mg"

/////////////////////////////////

- name: "Item 2"
- quantity: "[quantity]"
- calories: "[calories] kcal"
- protein: "[protein] g"
- carbs: "[carbs] g"
- fiber: "[fiber] g"
- fats: "[fats] g"
- water_content: "[water_content] ml"
- sugar: "[sugar] g"
- sodium: "[sodium] mg"
- cholesterol: "[cholesterol] mg"
- potassium: "[potassium] mg"
- vitamin_c: "[vitamin_c] mg"
- vitamin_a: "[vitamin_a] IU"
- calcium: "[calcium] mg"
- iron: "[iron] mg"

//////////////////////////////

- name: "Item 3"
- quantity: "[quantity]"
- calories: "[calories] kcal"
- protein: "[protein] g"
- carbs: "[carbs] g"
- fiber: "[fiber] g"
- fats: "[fats] g"
- water_content: "[water_content] ml"
- sugar: "[sugar] g"
- sodium: "[sodium] mg"
- cholesterol: "[cholesterol] mg"
- potassium: "[potassium] mg"
- vitamin_c: "[vitamin_c] mg"
- vitamin_a: "[vitamin_a] IU"
- calcium: "[calcium] mg"
- iron: "[iron] mg"

 // Continue for additional unique items

----
----
"""

if submit and uploaded_file is not None:
    image_data = input_image_setup(uploaded_file)
    response = get_gemini_response(input_prompt, image_data)
    st.subheader("The Response is")
    st.markdown(f'<div class="response">{response}</div>', unsafe_allow_html=True)
else:
    st.warning("Please upload an image and click Analyze to proceed.")


