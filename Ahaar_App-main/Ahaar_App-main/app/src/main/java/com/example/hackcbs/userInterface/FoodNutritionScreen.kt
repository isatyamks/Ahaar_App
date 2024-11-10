package com.example.hackcbs.userInterface

import androidx.compose.animation.AnimatedVisibility
import com.example.hackcbs.model.FoodNutrition
import com.example.hackcbs.viewmodel.FoodNutritionViewModel

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.LocalDining
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.hackcbs.viewmodel.SavedFoodViewModel
import kotlinx.coroutines.launch

// Custom Color Palette
object NutritionsColors {
    val Primary = Color(0xFF4CAF50)
    val PrimaryContainer = Color(0xFFE8F5E9)
    val Secondary = Color(0xFFFF9800)
    val SecondaryContainer = Color(0xFFFFE5CC)
    val Tertiary = Color(0xFF2196F3)
    val TertiaryContainer = Color(0xFFE1F5FE)
    val Background = Color(0xFFFAFAFA)
    val Surface = Color(0xFFFFFFFF)
    val Error = Color(0xFFB00020)

    // Nutrient Card Colors
    val CaloriesCard = Color(0xFFFFECB3)
    val ProteinCard = Color(0xFFE8F5E9)
    val CarbsCard = Color(0xFFFFF3E0)
    val FatsCard = Color(0xFFE1F5FE)
    val VitaminCard = Color(0xFFFFE0B2)
    val MineralCard = Color(0xFFE1BEE7)
}

@Composable
@OptIn(ExperimentalMaterial3Api::class)
fun FoodNutritionScreen(
    viewModel: FoodNutritionViewModel = viewModel(),
    savedViewModel: SavedFoodViewModel = viewModel()
) {
    val foodData by viewModel.foodData.collectAsState()
    val scope = rememberCoroutineScope()
    var showSheet by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = false)

    LaunchedEffect(foodData) {
        showSheet = foodData != null
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(NutritionsColors.Background)
    ) {
        if (showSheet && foodData != null) {
            ModalBottomSheet(
                sheetState = sheetState,
                onDismissRequest = {
                    scope.launch {
                        sheetState.hide()
                        showSheet = false
                    }
                },
                containerColor = NutritionsColors.Surface,
                dragHandle = {
                    Surface(
                        modifier = Modifier
                            .padding(vertical = 16.dp)
                            .width(40.dp)
                            .height(4.dp),
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                        shape = RoundedCornerShape(2.dp)
                    ) {}
                }
            ) {
                FoodNutritionCard(
                    food = foodData!!,
                    savedViewModel = savedViewModel
                )
                Spacer(modifier = Modifier.height(32.dp))
            }
        }

        AnimatedVisibility(
            visible = !showSheet,
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(10.dp)
                    .clickable {
                        scope.launch {
                            showSheet = true
                            sheetState.show()
                        }
                    },
                color = NutritionsColors.Primary,
                tonalElevation = 8.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        "----------------",
                        color = Color.White,
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            }
        }
    }
}

@Composable
fun FoodNutritionCard(
    food: FoodNutrition,
    savedViewModel: SavedFoodViewModel,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        // Header Section
        HeaderSection(
            foodName = food.name,
            onBookmarkClick = { savedViewModel.addFood(food) }
        )

        // Nutrition Overview
        NutritionOverview(food)

        // Detailed Nutrients
        DetailedNutrients()
    }
}

@Composable
private fun HeaderSection(
    foodName: String,
    onBookmarkClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 24.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Surface(
                modifier = Modifier.size(56.dp),
                shape = CircleShape,
                color = NutritionsColors.SecondaryContainer,
                tonalElevation = 4.dp
            ) {
                Icon(
                    imageVector = Icons.Outlined.LocalDining,
                    contentDescription = null,
                    modifier = Modifier.padding(12.dp),
                    tint = NutritionsColors.Secondary
                )
            }

            Column {
                Text(
                    text = foodName,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )

                ConfidenceIndicator()
            }
        }

        IconButton(
            onClick = onBookmarkClick,
            modifier = Modifier
                .clip(CircleShape)
                .background(NutritionsColors.PrimaryContainer)
        ) {
            Icon(
                imageVector = Icons.Default.BookmarkBorder,
                contentDescription = "Bookmark",
                tint = NutritionsColors.Primary
            )
        }
    }
}

@Composable
private fun ConfidenceIndicator() {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.padding(top = 4.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Visibility,
            contentDescription = null,
            modifier = Modifier.size(16.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )

        LinearProgressIndicator(
            progress = 0.72f,
            modifier = Modifier
                .width(80.dp)
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp)),
            color = NutritionsColors.Primary,
            trackColor = NutritionsColors.PrimaryContainer
        )

        Text(
            text = "72%",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun NutritionOverview(food: FoodNutrition) {
    Text(
        text = "Nutrition Overview",
        style = MaterialTheme.typography.titleLarge,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.padding(bottom = 16.dp)
    )

    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            NutrientCard(
                icon = Icons.Default.LocalFireDepartment,
                value = food.calories,
                label = "Calories",
                backgroundColor = NutritionsColors.CaloriesCard
            )
        }
        item {
            NutrientCard(
                icon = Icons.Default.Restaurant,
                value = food.protein,
                label = "Protein",
                backgroundColor = NutritionsColors.ProteinCard
            )
        }
        item {
            NutrientCard(
                icon = Icons.Default.Grain,
                value = food.carbs,
                label = "Carbs",
                backgroundColor = NutritionsColors.CarbsCard
            )
        }
        item {
            NutrientCard(
                icon = Icons.Default.Water,
                value = food.fats,
                label = "Fats",
                backgroundColor = NutritionsColors.FatsCard
            )
        }
    }
}

@Composable
private fun DetailedNutrients() {
    Column(
        modifier = Modifier.padding(top = 32.dp)
    ) {
        Text(
            text = "Detailed Nutrients",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Vitamins
            items(4) { index ->
                NutrientCard(
                    icon = Icons.Default.Water,
                    value = "${(index + 1) * 10} mg",
                    label = "Vitamin ${('A' + index)}",
                    backgroundColor = NutritionsColors.VitaminCard
                )
            }

            // Minerals
            items(4) { index ->
                NutrientCard(
                    icon = Icons.Default.Water,
                    value = "${(index + 1) * 5} mg",
                    label = "Mineral ${index + 1}",
                    backgroundColor = NutritionsColors.MineralCard
                )
            }
        }
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
        shape = RoundedCornerShape(16.dp),
        color = backgroundColor,
        tonalElevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
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