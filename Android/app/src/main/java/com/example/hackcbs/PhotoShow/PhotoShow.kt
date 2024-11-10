package com.example.hackcbs.PhotoShow

import android.app.AlertDialog
import android.graphics.Bitmap
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.PaintingStyle
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun PhotoConfirmationDialog(
    bitmap: Bitmap?,
    onContinue: () -> Unit,
    onUpload: (Bitmap) -> Unit,
    onDismiss: () -> Unit
) {
    if (bitmap != null) {
        AlertDialog(
            onDismissRequest = onDismiss,
            title = { Text("Confirm Photo") },
            text = {
                Column {
                    Image(
                        bitmap = bitmap.asImageBitmap(),
                        contentDescription = "Captured Photo",
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Do you want to continue or upload this photo?")
                }
            },
            confirmButton = {
                Button(onClick = { onUpload(bitmap) }) {
                    Text("Upload")
                }
            },
            dismissButton = {
                Button(onClick = onContinue) {
                    Text("Continue")
                }
            }
        )
    }
}


@Composable
fun RoundedEdgeDetectionBox(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 16.dp,       // Radius of the rounded corners
    edgeLength: Dp = 30.dp,         // Length of each edge line from the corners
    borderThickness: Dp = 4.dp,     // Thickness of the edges
    color: Color = Color.White      // Color of the edge lines
) {
    Canvas(modifier = modifier.size(310.dp,330.dp)) { // Adjust size as needed
        val boxWidth = size.width
        val boxHeight = size.height
        val edgeLengthPx = edgeLength.toPx()
        val cornerRadiusPx = cornerRadius.toPx()
        val borderThicknessPx = borderThickness.toPx()

        // Paint for drawing edges and arcs
        val paint = Paint().apply {
            this.color = color
            this.strokeWidth = borderThicknessPx
            this.style = PaintingStyle.Stroke
        }

        // Draw edges with rounded corners using lines and arcs
        // Top-left corner
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(cornerRadiusPx, 0f),
            end = Offset(cornerRadiusPx + edgeLengthPx, 0f)
        )
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(0f, cornerRadiusPx),
            end = Offset(0f, cornerRadiusPx + edgeLengthPx)
        )
        drawArc(
            color = color,
            topLeft = Offset(0f, 0f),
            size = Size(cornerRadiusPx * 2, cornerRadiusPx * 2),
            startAngle = 180f,
            sweepAngle = 90f,
            useCenter = false,
            style = Stroke(width = borderThicknessPx)
        )

        // Top-right corner
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(boxWidth - cornerRadiusPx, 0f),
            end = Offset(boxWidth - cornerRadiusPx - edgeLengthPx, 0f)
        )
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(boxWidth, cornerRadiusPx),
            end = Offset(boxWidth, cornerRadiusPx + edgeLengthPx)
        )
        drawArc(
            color = color,
            topLeft = Offset(boxWidth - cornerRadiusPx * 2, 0f),
            size = Size(cornerRadiusPx * 2, cornerRadiusPx * 2),
            startAngle = 270f,
            sweepAngle = 90f,
            useCenter = false,
            style = Stroke(width = borderThicknessPx)
        )

        // Bottom-left corner
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(0f, boxHeight - cornerRadiusPx),
            end = Offset(0f, boxHeight - cornerRadiusPx - edgeLengthPx)
        )
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(cornerRadiusPx, boxHeight),
            end = Offset(cornerRadiusPx + edgeLengthPx, boxHeight)
        )
        drawArc(
            color = color,
            topLeft = Offset(0f, boxHeight - cornerRadiusPx * 2),
            size = Size(cornerRadiusPx * 2, cornerRadiusPx * 2),
            startAngle = 90f,
            sweepAngle = 90f,
            useCenter = false,
            style = Stroke(width = borderThicknessPx)
        )

        // Bottom-right corner
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(boxWidth - cornerRadiusPx, boxHeight),
            end = Offset(boxWidth - cornerRadiusPx - edgeLengthPx, boxHeight)
        )
        drawLine(
            color = color,
            strokeWidth = borderThicknessPx,
            start = Offset(boxWidth, boxHeight - cornerRadiusPx),
            end = Offset(boxWidth, boxHeight - cornerRadiusPx - edgeLengthPx)
        )
        drawArc(
            color = color,
            topLeft = Offset(boxWidth - cornerRadiusPx * 2, boxHeight - cornerRadiusPx * 2),
            size = Size(cornerRadiusPx * 2, cornerRadiusPx * 2),
            startAngle = 0f,
            sweepAngle = 90f,
            useCenter = false,
            style = Stroke(width = borderThicknessPx)
        )
    }
}


