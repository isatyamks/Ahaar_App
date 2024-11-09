package com.example.hackcbs.model

import kotlinx.serialization.Serializable

@Serializable
data class FoodNutrition(
    val calcium: String,
    val calories: String,
    val carbs: String,
    val cholesterol: String,
    val fats: String,
    val fiber: String,
    val iron: String,
    val name: String,
    val potassium: String,
    val protein: String,
    val quantity: String,
    val sodium: String,
    val sugar: String,
    val vitamin_a: String,
    val vitamin_c: String,
    val water_content: String
)