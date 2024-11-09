package com.example.hackcbs

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Grain
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.Water
import androidx.compose.material.icons.outlined.LocalDining
import androidx.compose.material3.*
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.hackcbs.model.FoodNutrition
import com.example.hackcbs.viewmodel.FoodNutritionViewModel

@Composable
fun FoodNutritionScreen(
    viewModel: FoodNutritionViewModel =  viewModel()
) {
    val foodData by viewModel.foodData.collectAsState()

    foodData?.let { food ->
        FoodNutritionCard(food)
    }
}


@Composable
fun FoodNutritionCard(
    food: FoodNutrition,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Header section with food name and confidence
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Food icon
                    Surface(
                        modifier = Modifier.size(48.dp),
                        shape = CircleShape,
                        color = Color(0xFFFFE5CC)
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.LocalDining,
                            contentDescription = null,
                            modifier = Modifier.padding(12.dp),
                            tint = Color(0xFFFF9933)
                        )
                    }

                    Column {
                        Text(
                            text = food.name,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Visibility,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp),
                                tint = Color.Gray
                            )
                            LinearProgressIndicator(
                                progress = 0.72f,
                                modifier = Modifier
                                    .width(80.dp)
                                    .height(4.dp),
                                color = Color(0xFF4CAF50),
                                trackColor = Color(0xFFE0E0E0)
                            )
                            Text(
                                text = "72%",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.Gray
                            )
                        }
                    }
                }

                IconButton(onClick = { /* Bookmark action */ }) {
                    Icon(
                        imageVector = Icons.Default.BookmarkBorder,
                        contentDescription = "Bookmark",
                        tint = Color(0xFF4CAF50)
                    )
                }
            }

            // Action buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ActionButton(
                    icon = Icons.Default.Refresh,
                    text = "Reset"
                )
                ActionButton(
                    icon = Icons.Default.Lightbulb,
                    text = "Nutrients",
                    isHighlighted = true
                )
                ActionButton(
                    icon = Icons.Default.FitnessCenter,
                    text = "Exercise"
                )
                ActionButton(
                    icon = Icons.Default.Info,
                    text = "Info"
                )
            }

            // Nutrition section
            Column(
                modifier = Modifier.padding(top = 8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Nutrition",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Per: ${food.quantity}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }

                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(top = 16.dp)
                ) {
                    item {
                        NutrientCard(
                            icon = Icons.Default.LocalFireDepartment,
                            value = food.calories,
                            label = "Calories",
                            backgroundColor = Color(0xFFFFE5CC)
                        )
                    }
                    item {
                        NutrientCard(
                            icon = Icons.Default.Restaurant,
                            value = food.protein,
                            label = "Protein",
                            backgroundColor = Color(0xFFE8F5E9)
                        )
                    }
                    item {
                        NutrientCard(
                            icon = Icons.Default.Grain,
                            value = food.carbs,
                            label = "Carbs",
                            backgroundColor = Color(0xFFFFF3E0)
                        )
                    }
                    item {
                        NutrientCard(
                            icon = Icons.Default.Water,
                            value = food.fats,
                            label = "Fats",
                            backgroundColor = Color(0xFFE1F5FE)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ActionButton(
    icon: ImageVector,
    text: String,
    isHighlighted: Boolean = false
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (isHighlighted) Color(0xFF4CAF50) else Color.Transparent)
            .padding(8.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = text,
            tint = if (isHighlighted) Color.White else Color.Gray,
            modifier = Modifier.size(24.dp)
        )
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = if (isHighlighted) Color.White else Color.Gray,
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}

@Composable
private fun NutrientCard(
    icon: ImageVector,
    value: String,
    label: String,
    backgroundColor: Color
) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = backgroundColor,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color.DarkGray,
                modifier = Modifier.size(24.dp)
            )
            Column {
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.DarkGray
                )
            }
        }
    }
}