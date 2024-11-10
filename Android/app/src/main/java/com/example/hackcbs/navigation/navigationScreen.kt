import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import kotlinx.serialization.Serializable

sealed interface Screen{

    @Serializable
    data object RegistrationScreen : Screen

    @Serializable
    data object LoginScreen : Screen

    @Serializable
    data object CameraScreen : Screen

    @Serializable
    data object HomeScreen : Screen

    @Serializable
    data object ProfileScreen : Screen

    @Serializable
    data object SummaryScreen : Screen

    @Serializable
    data object MainScreen : Screen

    @Serializable
    data object SavedFood:Screen

    @Serializable
    data object FoodNutritionScreen:Screen

}