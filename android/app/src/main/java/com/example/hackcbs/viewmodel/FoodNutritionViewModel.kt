package com.example.hackcbs.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.hackcbs.model.FoodNutrition
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json

class FoodNutritionViewModel(application: Application) : AndroidViewModel(application) {
    private val _foodData = MutableStateFlow<FoodNutrition?>(null)
    val foodData: StateFlow<FoodNutrition?> = _foodData.asStateFlow()

    init {
        loadFoodData()
    }

    private fun loadFoodData() {
        viewModelScope.launch {
            try {
                // Try to open the asset file and read it
                val inputStream = getApplication<Application>().assets.open("response.json")
                val jsonString = inputStream.bufferedReader().use { it.readText() }

                Log.d("FoodNutritionViewModel", "JSON String: $jsonString")  // Log the raw JSON data

                // Deserialize the JSON string into the FoodNutrition object
                val food = Json.decodeFromString<FoodNutrition>(jsonString)
                _foodData.value = food
            } catch (e: Exception) {
                Log.e("FoodNutritionViewModel", "Error loading food data", e)
            }
        }
    }

}