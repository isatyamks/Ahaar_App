package com.example.hackcbs.userInterface

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import com.example.hackcbs.R
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FirstScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Companion.White)
    ) {
        // Background Image that takes full screen
        Image(
            painter = painterResource(id = R.drawable.firstpage),
            contentDescription = "Thali Background",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Companion.FillHeight
        )
        Column(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalAlignment = Alignment.Companion.CenterHorizontally // Centers all child elements horizontally
        ) {
            Image(
                painter = painterResource(id = R.drawable.logo),
                contentDescription = "Logo",
                modifier = Modifier
                    .size(200.dp)
                    .padding(top = 100.dp)
                    .zIndex(1f)
            )
        }


        // Buttons Container - positioned at the bottom white space
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.Companion.CenterHorizontally
        ) {
            // Login Button with shadow
            ElevatedButton(
                onClick = { /* Handle login */ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.elevatedButtonColors(
                    containerColor = Color(0xFF22C55E),
                    contentColor = Color.Companion.White
                ),
                elevation = ButtonDefaults.elevatedButtonElevation(
                    defaultElevation = 6.dp,
                    pressedElevation = 8.dp
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    text = "Login",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Companion.SemiBold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Sign Up Button
            OutlinedButton(
                onClick = { /* Handle sign up */ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = Color(0xFF22C55E)
                ),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
            ) {
                Text(
                    text = "Sign Up",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Companion.SemiBold
                )
            }

            // Bottom spacing
            Spacer(modifier = Modifier.height(32.dp))


        }
    }
}
