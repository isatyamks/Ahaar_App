package com.example.hackcbs.viewmodel

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import com.example.hackcbs.model.FoodNutrition

class SavedFoodViewModel : ViewModel() {
    private val _savedFoods = mutableStateListOf<FoodNutrition>()
    val savedFoods: List<FoodNutrition> = _savedFoods

    fun addFood(food: FoodNutrition) {
        if (!_savedFoods.contains(food)) {
            _savedFoods.add(food)
        }
    }

    fun removeFood(food: FoodNutrition) {
        _savedFoods.remove(food)
    }
}