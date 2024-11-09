import os
import json
import requests
import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from PIL import Image
import google.generativeai as genai

# Set the API Key and Configure the Model
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
# Streamlit Interface
st.title("Ahaar - Nutritional Tracker")
st.write("Upload an image of your food, and we will provide a detailed nutritional breakdown with visualizations.")

uploaded_file = st.file_uploader("Choose an image...", type="jpg")

if uploaded_file is not None:
    # Display the uploaded image
    img = Image.open(uploaded_file)
    st.image(img, caption="Uploaded Food Image", use_column_width=True)
    
    # Process the image using the Gemini API
    image_data = input_image_setup(uploaded_file)
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
    response_data = get_gemini_response(input_prompt, image_data)

    # Display the detected food items
    detected_items = response_data.get("Detected Food Items", [])
    if detected_items:
        food_data = detected_items[0]  # Assuming a single food item for simplicity
        
        st.subheader(f"Food: {food_data['name']}")
        st.write(f"Quantity: {food_data['quantity']}")
        st.write(f"Calories: {food_data['calories']}")
        st.write(f"Protein: {food_data['protein']}")
        st.write(f"Carbs: {food_data['carbs']}")
        st.write(f"Fiber: {food_data['fiber']}")
        st.write(f"Fats: {food_data['fats']}")
        st.write(f"Water Content: {food_data['water_content']}")
        st.write(f"Sugar: {food_data['sugar']}")
        st.write(f"Sodium: {food_data['sodium']}")
        st.write(f"Cholesterol: {food_data['cholesterol']}")
        st.write(f"Potassium: {food_data['potassium']}")
        st.write(f"Vitamin C: {food_data['vitamin_c']}")
        st.write(f"Vitamin A: {food_data['vitamin_a']}")
        st.write(f"Calcium: {food_data['calcium']}")
        st.write(f"Iron: {food_data['iron']}")

        # Prepare data for visualization
        nutrition_labels = ['Calories', 'Protein', 'Carbs', 'Fiber', 'Fats', 'Water Content', 'Sugar', 'Sodium', 'Cholesterol', 'Potassium', 'Vitamin C', 'Vitamin A', 'Calcium', 'Iron']
        nutrition_values = [
            int(food_data['calories'].split()[0]),
            int(food_data['protein'].split()[0]),
            int(food_data['carbs'].split()[0]),
            int(food_data['fiber'].split()[0]),
            int(food_data['fats'].split()[0]),
            int(food_data['water_content'].split()[0]),
            int(food_data['sugar'].split()[0]),
            int(food_data['sodium'].split()[0]),
            int(food_data['cholesterol'].split()[0]),
            int(food_data['potassium'].split()[0]),
            int(food_data['vitamin_c'].split()[0]),
            int(food_data['vitamin_a'].split()[0]),
            int(food_data['calcium'].split()[0]),
            int(food_data['iron'].split()[0])
        ]
        
        # Create a DataFrame for plotting
        nutrition_df = pd.DataFrame({
            'Nutrient': nutrition_labels,
            'Amount': nutrition_values
        })

        # Create a bar plot for visualization
        st.subheader("Nutritional Breakdown")
        plt.figure(figsize=(10, 6))
        sns.barplot(x='Amount', y='Nutrient', data=nutrition_df, palette='viridis')
        plt.title("Nutritional Breakdown of Food")
        st.pyplot(plt)

        # Create a pie chart for macronutrient distribution (Carbs, Protein, Fats)
        st.subheader("Macronutrient Distribution")
        macronutrients = ['Carbs', 'Protein', 'Fats']
        macronutrient_values = [
            int(food_data['carbs'].split()[0]),
            int(food_data['protein'].split()[0]),
            int(food_data['fats'].split()[0])
        ]
        plt.figure(figsize=(8, 8))
        plt.pie(macronutrient_values, labels=macronutrients, autopct='%1.1f%%', startangle=90, colors=['#ffcc00', '#ff6600', '#ff3300'])
        plt.title("Macronutrient Distribution")
        st.pyplot(plt)

        # Display additional recommendations
        st.subheader("Dietary Recommendations")
        st.write("Based on your nutritional intake, we recommend the following:")
        if food_data['carbs'] > '40 g':
            st.write("- Consider reducing carb intake for a more balanced diet.")
        if food_data['protein'] < '10 g':
            st.write("- Include more protein-rich foods to meet your daily requirements.")
        if food_data['fats'] > '20 g':
            st.write("- Reduce saturated fats to maintain a healthy lifestyle.")
        st.write("Stay hydrated and maintain a balanced diet!")
