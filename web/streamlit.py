from dotenv import load_dotenv

load_dotenv()  

import streamlit as st
import os
import google.generativeai as genai
from PIL import Image

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




st.set_page_config(page_title="Ahaar")

st.header("Ahaar")
st.write("Upload your food picture and get detailed nutritional information.")

# File uploader widget
uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

image = ""
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image.", use_column_width=True)

# Button to trigger image analysis
submit = st.button("Analyze the Picture")

# Input prompt for the generative AI model
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
    st.write(response)
else:
    st.warning("Please upload an image and click Analyze to proceed.")

st.warning("Ahaar can make mistakes.")
