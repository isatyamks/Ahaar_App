package com.example.hackcbs.viewmodel

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Matrix // Use the correct Matrix import
import android.util.Log
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
import androidx.camera.view.LifecycleCameraController
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class CameraXViewmodel : ViewModel() {
    private val _bitmaps = MutableStateFlow<List<Bitmap>>(emptyList())
    val bitmaps = _bitmaps.asStateFlow()

    private val _latestBitmap = MutableStateFlow<Bitmap?>(null)
    val latestBitmap: StateFlow<Bitmap?> = _latestBitmap.asStateFlow()

    fun addBitmap(bitmap: Bitmap) {
        _latestBitmap.value = bitmap
        _bitmaps.value = _bitmaps.value + bitmap
    }

    fun clearLatestBitmap() {
        _latestBitmap.value = null
    }

    fun takePhoto(
        controller: LifecycleCameraController,
        applicationContext: Context,
        onPhotoTaken: (Bitmap) -> Unit
    ) {
        controller.takePicture(
            ContextCompat.getMainExecutor(applicationContext),
            object : ImageCapture.OnImageCapturedCallback() {
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
                    image.close() // Always close the ImageProxy after processing
                }

                override fun onError(exception: ImageCaptureException) {
                    Log.e("Camera", "Error taking photo", exception)
                }
            }
        )
    }
}
