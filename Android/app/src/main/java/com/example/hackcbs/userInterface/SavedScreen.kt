package com.example.hackcbs.userInterface

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.hackcbs.model.FoodNutrition
import com.example.hackcbs.viewmodel.SavedFoodViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedScreen(
    viewModel: SavedFoodViewModel = viewModel(),
    onFoodClick: (FoodNutrition) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Saved Foods",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = NutritionsColors.Surface
                )
            )
        }
    ) { paddingValues ->
        if (viewModel.savedFoods.isEmpty()) {
            EmptyStateView(modifier = Modifier.padding(paddingValues))
        } else {
            SavedFoodsList(
                savedFoods = viewModel.savedFoods,
                onFoodClick = onFoodClick,
                onRemove = viewModel::removeFood,
                modifier = Modifier.padding(paddingValues)
            )
        }
    }
}

@Composable
private fun EmptyStateView(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(NutritionsColors.Background),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(32.dp)
        ) {
            Icon(
                imageVector = Icons.Default.BookmarkBorder,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = NutritionsColors.Primary
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No saved foods yet",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Bookmark your favorite foods to see them here",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

@Composable
private fun SavedFoodsList(
    savedFoods: List<FoodNutrition>,
    onFoodClick: (FoodNutrition) -> Unit,
    onRemove: (FoodNutrition) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(NutritionsColors.Background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        items(savedFoods) { food ->
            SavedFoodCard(
                food = food,
                onClick = { onFoodClick(food) },
                onRemove = { onRemove(food) }
            )
        }
    }
}

@Composable
private fun SavedFoodCard(
    food: FoodNutrition,
    onClick: () -> Unit,
    onRemove: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = NutritionsColors.Surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    modifier = Modifier.size(48.dp),
                    shape = MaterialTheme.shapes.medium,
                    color = NutritionsColors.PrimaryContainer
                ) {
                    Icon(
                        imageVector = Icons.Default.LocalDining,
                        contentDescription = null,
                        modifier = Modifier.padding(12.dp),
                        tint = NutritionsColors.Primary
                    )
                }

                Column {
                    Text(
                        text = food.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        NutrientChip(
                            icon = Icons.Default.LocalFireDepartment,
                            value = "${food.calories} cal"
                        )
                        NutrientChip(
                            icon = Icons.Default.Restaurant,
                            value = "${food.protein}g protein"
                        )
                    }
                }
            }

            IconButton(onClick = onRemove) {
                Icon(
                    imageVector = Icons.Default.Bookmark,
                    contentDescription = "Remove from saved",
                    tint = NutritionsColors.Primary
                )
            }
        }
    }
}

@Composable
private fun NutrientChip(
    icon: ImageVector,
    value: String
) {
    Surface(
        color = NutritionsColors.PrimaryContainer,
        shape = MaterialTheme.shapes.small
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = NutritionsColors.Primary
            )
            Text(
                text = value,
                style = MaterialTheme.typography.bodySmall,
                color = NutritionsColors.Primary
            )
        }
    }
}