package com.example.hackcbs.userInterface

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.hackcbs.model.FoodNutrition
import com.example.hackcbs.viewmodel.FoodNutritionViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SummaryScreen(
    viewModel: FoodNutritionViewModel = viewModel()
) {
    val foodData by viewModel.foodData.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NutritionsColors.Background)
            .padding(top = 80.dp, start = 30.dp, end = 30.dp)
    ) {
        // Header with Food Name
        foodData?.let { food ->
            Text(
                text = "Nutrition Summary",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp).align(Alignment.CenterHorizontally)
            )

            Text(
                text = "Quantity: ${food.quantity}",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                modifier = Modifier.padding(bottom = 24.dp)
            )
        }

        // Monthly Summary
        MonthlySummary(foodData)

        Spacer(modifier = Modifier.height(32.dp))

        // Weekly Summary
        WeeklySummary(foodData)
    }
}

@Composable
private fun MonthlySummary(food: FoodNutrition?) {
    if (food == null) return

    Column {
        Text(
            text = "Daily Overview",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SummaryCard(
                icon = Icons.Default.Restaurant,
                value = food.monthly_protein,
                label = "Protein",
                backgroundColor = NutritionsColors.ProteinCard,
                modifier = Modifier.weight(1f)
            )
            SummaryCard(
                icon = Icons.Default.Grain,
                value = food.monthly_carbs,
                label = "Carbs",
                backgroundColor = NutritionsColors.CarbsCard,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SummaryCard(
                icon = Icons.Default.Water,
                value = food.monthly_fats,
                label = "Fats",
                backgroundColor = NutritionsColors.FatsCard,
                modifier = Modifier.weight(1f)
            )
            SummaryCard(
                icon = Icons.Default.WaterDrop,
                value = food.monthly_waterContent,
                label = "Water",
                backgroundColor = NutritionsColors.VitaminCard,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun WeeklySummary(food: FoodNutrition?) {
    if (food == null) return

    Column {
        Text(
            text = "Weekly Overview",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SummaryCard(
                icon = Icons.Default.Restaurant,
                value = food.weekly_protein,
                label = "Protein",
                backgroundColor = NutritionsColors.ProteinCard,
                modifier = Modifier.weight(1f)
            )
            SummaryCard(
                icon = Icons.Default.Grain,
                value = food.weekly_carbs,
                label = "Carbs",
                backgroundColor = NutritionsColors.CarbsCard,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SummaryCard(
                icon = Icons.Default.Water,
                value = food.weekly_fats,
                label = "Fats",
                backgroundColor = NutritionsColors.FatsCard,
                modifier = Modifier.weight(1f)
            )
            SummaryCard(
                icon = Icons.Default.WaterDrop,
                value = food.weekly_waterContent,
                label = "Water",
                backgroundColor = NutritionsColors.VitaminCard,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun SummaryCard(
    icon: ImageVector,
    value: String,
    label: String,
    backgroundColor: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = backgroundColor,
        tonalElevation = 4.dp,
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Surface(
                shape = CircleShape,
                color = Color.White.copy(alpha = 0.8f),
                modifier = Modifier.size(40.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(8.dp)
                )
            }

            Column {
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
        }
    }
}