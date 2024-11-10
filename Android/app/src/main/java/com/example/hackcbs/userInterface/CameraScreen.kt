import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Camera
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.Camera
import androidx.compose.material.icons.outlined.Bookmark
import androidx.compose.material.icons.outlined.Science
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.hackcbs.CameraScreen
import com.example.hackcbs.userInterface.FoodNutritionScreen
import com.example.hackcbs.userInterface.SavedScreen
import com.example.hackcbs.userInterface.SummaryScreen
import com.example.hackcbs.userInterface.UserProfileScreen
import com.example.hackcbs.viewmodel.FoodNutritionViewModel
import com.example.hackcbs.viewmodel.SavedFoodViewModel

// Custom Color Palette matching the provided code
object AppColors {
    val Primary = Color(0xFF4CAF50)
    val PrimaryContainer = Color(0xFFE8F5E9)
    val Secondary = Color(0xFFFF9800)
    val SecondaryContainer = Color(0xFFFFE5CC)
    val Tertiary = Color(0xFF2196F3)
    val TertiaryContainer = Color(0xFFE1F5FE)
    val Background = Color(0xFFFAFAFA)
    val Surface = Color(0xFFFFFFFF)
    val Error = Color(0xFFB00020)
}


data class BottomNavItem(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val containerColor: Color
)

@Composable
fun MainScreen(FoodNutritionViewModel:FoodNutritionViewModel, savedFoodViewModel: SavedFoodViewModel, navController: NavController) {
    val navController = rememberNavController()
    var selectedItemIndex by remember { mutableStateOf(2) } // Start with the Camera item selected (index 2 in the list)

    val items = listOf(
        BottomNavItem("Profile", Icons.Filled.AccountCircle, Icons.Outlined.AccountCircle, AppColors.PrimaryContainer),
        BottomNavItem("Summary", Icons.Filled.Favorite, Icons.Outlined.FavoriteBorder, AppColors.SecondaryContainer),
        BottomNavItem("Camera", Icons.Filled.Camera, Icons.Outlined.Camera, AppColors.TertiaryContainer),
        BottomNavItem("Saved", Icons.Filled.Bookmark, Icons.Outlined.Bookmark, AppColors.SecondaryContainer)
    )

    Scaffold(
        containerColor = AppColors.Background,
        bottomBar = {
            NavigationBar(
                containerColor = AppColors.Surface,
                tonalElevation = 8.dp,
                modifier = Modifier.height(80.dp)
            ) {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = {
                            Icon(
                                imageVector = if (selectedItemIndex == index) item.selectedIcon else item.unselectedIcon,
                                contentDescription = item.title,
                                modifier = Modifier.size(26.dp),
                                tint = if (selectedItemIndex == index) AppColors.Primary else Color.Gray.copy(alpha = 0.7f)
                            )
                        },
                        label = {
                            Text(
                                text = item.title,
                                color = if (selectedItemIndex == index) AppColors.Primary else Color.Gray.copy(alpha = 0.7f)
                            )
                        },
                        selected = selectedItemIndex == index,
                        onClick = {
                            selectedItemIndex = index
                            when (item.title) {
                                "Profile" -> navController.navigate("profile") { popUpTo(navController.graph.startDestinationId) { inclusive = true } }
                                "Summary" -> navController.navigate("summary") { popUpTo(navController.graph.startDestinationId) { inclusive = true } }
                                "Camera" -> navController.navigate("camera") { popUpTo(navController.graph.startDestinationId) { inclusive = true } }
                                "Saved" -> navController.navigate("saved") { popUpTo(navController.graph.startDestinationId) { inclusive = true } }
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = item.containerColor
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "camera" // Set the start destination to "camera"
        ) {
            composable("profile") { UserProfileScreen(navController) }
            composable("summary") { SummaryScreen(FoodNutritionViewModel) }
            composable("camera") { CameraScreen(navController, paddingValues) }
            composable("saved") { SavedScreen(savedFoodViewModel, onFoodClick = { navController.navigate("foodNutrition/$it") })  }
        }
    }
}



