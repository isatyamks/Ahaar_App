package com.example.hackcbs

import MainScreen
import Screen
import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Matrix
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.camera.core.ImageCapture.OnImageCapturedCallback
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
import androidx.camera.view.CameraController
import androidx.camera.view.LifecycleCameraController
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Circle
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.hackcbs.PhotoShow.PhotoConfirmationDialog
import com.example.hackcbs.PhotoShow.RoundedEdgeDetectionBox
import com.example.hackcbs.ui.theme.HackCBSTheme
import com.example.hackcbs.userInterface.FoodNutritionScreen
import com.example.hackcbs.userInterface.LoginScreen
import com.example.hackcbs.userInterface.NutritionsColors
import com.example.hackcbs.userInterface.RegistrationScreen
import com.example.hackcbs.userInterface.SavedScreen
import com.example.hackcbs.userInterface.SummaryScreen
import com.example.hackcbs.userInterface.UserProfileScreen
import com.example.hackcbs.viewmodel.CameraXViewmodel
import com.example.hackcbs.viewmodel.FoodNutritionViewModel
import com.example.hackcbs.viewmodel.SavedFoodViewModel
import com.google.firebase.FirebaseApp

class MainActivity : ComponentActivity() {
    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (!hasRequiredPermissions()) {
            requestPermissions(CAMERAX_PERMISSIONS, 0)
        }
        FirebaseApp.initializeApp(this)
        enableEdgeToEdge()

        setContent {
            HackCBSTheme {
                val navController = rememberNavController()

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val controller = remember {
                        LifecycleCameraController(applicationContext).apply {
                            setEnabledUseCases(
                                CameraController.IMAGE_CAPTURE or CameraController.VIDEO_CAPTURE
                            )
                        }
                    }

                    val viewModel: CameraXViewmodel = viewModel()
                    val FoodNutritionViewModel:FoodNutritionViewModel = viewModel()
                    val latestBitmap by viewModel.latestBitmap.collectAsState()
                    val SavedFoodViewModel: SavedFoodViewModel = viewModel()

                    PhotoConfirmationDialog(
                        bitmap = latestBitmap,
                        onContinue = { viewModel.clearLatestBitmap() },
                        onUpload = { /* Handle upload */ },
                        onDismiss = { viewModel.clearLatestBitmap() }
                    )

                    NavHost(
                        navController = navController,
                        startDestination = Screen.RegistrationScreen
                    ) {
                        composable<Screen.RegistrationScreen> {
                            RegistrationScreen(navController = navController)
                        }
                        composable<Screen.LoginScreen> {
                            LoginScreen(navController = navController)
                        }
                        composable<Screen.CameraScreen> {
                            val context: Context = LocalContext.current
                            CameraScreen(
                                navController = navController,
                                viewModel = viewModel,
                                context = context,
                                paddingValues = PaddingValues(16.dp)
                            )
                        }

                        composable<Screen.HomeScreen> {
                            MainScreen(FoodNutritionViewModel,SavedFoodViewModel,navController)
                        }

                        composable<Screen.ProfileScreen> {
                            UserProfileScreen(navController)
                        }

                        composable<Screen.SummaryScreen> {
                            SummaryScreen(FoodNutritionViewModel)
                        }

                        composable<Screen.SavedFood> {
//                            SavedScreen(SavedFoodViewModel)
                        }

                        composable<Screen.FoodNutritionScreen> {
                            FoodNutritionScreen(FoodNutritionViewModel,SavedFoodViewModel)
                        }
                    }
                }
            }
        }
    }

     fun takePhoto(controller: LifecycleCameraController, onPhotoTaken: (Bitmap) -> Unit) {
        controller.takePicture(
            ContextCompat.getMainExecutor(applicationContext),
            object : OnImageCapturedCallback() {
                override fun onCaptureSuccess(image: ImageProxy) {
                    super.onCaptureSuccess(image)
                    val matrix = Matrix().apply {
                        postRotate(image.imageInfo.rotationDegrees.toFloat())
                    }
                    val rotatedBitmap = Bitmap.createBitmap(
                        image.toBitmap(),
                        0,
                        0,
                        image.width,
                        image.height,
                        matrix,
                        true
                    )
                    onPhotoTaken(rotatedBitmap)
                }

                override fun onError(exception: ImageCaptureException) {
                    Log.e("Camera", "Error taking photo", exception)
                }
            }
        )
    }

    private fun hasRequiredPermissions(): Boolean {
        return CAMERAX_PERMISSIONS.all {
            ContextCompat.checkSelfPermission(
                applicationContext,
                it
            ) == PackageManager.PERMISSION_GRANTED
        }
    }

    companion object {
        private val CAMERAX_PERMISSIONS = arrayOf(
            Manifest.permission.CAMERA,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
        )
    }
}

// Separate composable for the CameraScreen to manage camera UI and controls
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CameraScreen(
    navController: NavController,
    paddingValues: PaddingValues,
    viewModel: CameraXViewmodel = viewModel(),
    context: Context = LocalContext.current
) {
    val controller = remember {
        LifecycleCameraController(context).apply {
            setEnabledUseCases(CameraController.IMAGE_CAPTURE or CameraController.VIDEO_CAPTURE)
        }
    }

    BottomSheetScaffold(
        sheetPeekHeight = 0.dp,
        sheetContent = {}
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            CameraPreview(controller = controller, modifier = Modifier.fillMaxSize())
            RoundedEdgeDetectionBox(
                modifier = Modifier
                    .align(Alignment.Center)
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                IconButton(onClick = {
////                    viewModel.takePhoto(controller, context) { bitmap ->
////                        viewModel.addBitmap(bitmap)
////                    }
//                    navController.navigate(Screen.FoodNutritionScreen)
                    navController.navigate(Screen.FoodNutritionScreen)
                },
                    modifier = Modifier.size(96.dp)
                    ) {
                    Icon(
                        imageVector = Icons.Filled.Circle,
                        contentDescription = "Take Picture",
                        tint = NutritionsColors.Primary,
                        modifier = Modifier.size(96.dp)
                    )
                }
            }
        }
    }
}

