package com.example.hackcbs.userInterface

import Screen
import android.R.id.icon
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.hackcbs.R
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
//import com.example.hackcbs.viewmodel.LoginState
//import com.example.hackcbs.viewmodel.LoginViewModel

@Composable
fun LoginScreen(
    navController: NavController,
//    viewModel: LoginViewModel = viewModel()
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
//    val loginState = viewModel.loginState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    // Handle login state changes
//    LaunchedEffect(loginState.value) {
//        when (val state = loginState.value) {
//            is LoginState.Success -> {
//                snackbarHostState.showSnackbar(state.message)
//                navController.navigate(Screen.CameraScreen) {
//                    popUpTo(0) { inclusive = true }
//                }
//                viewModel.resetLoginState()
//            }
//            is LoginState.Error -> {
//                snackbarHostState.showSnackbar(state.message)
//                viewModel.resetLoginState()
//            }
//            else -> {}
//        }
//    }

    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.second_login_pageeee),
            contentDescription = "Food Background",
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 350.dp),
            contentScale = ContentScale.Companion.FillBounds
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 200.dp),
            horizontalAlignment = Alignment.Companion.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFF5F5F5)
                )
            ) {
                Column(
                    modifier = Modifier
                        .padding(24.dp),
                    horizontalAlignment = Alignment.Companion.CenterHorizontally
                ) {
                    Text(
                        text = "Sign In",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Companion.Bold,
                        modifier = Modifier.padding(bottom = 24.dp)
                    )

                    // Email Field
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        singleLine = true,
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Default.Email,
                                contentDescription = "Email Icon"
                            )
                        },
//                        enabled = loginState.value !is LoginState.Loading
                    )

                    // Password Field
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp),
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = "Lock Icon"
                            )
                        },
//                        enabled = loginState.value !is LoginState.Loading
                    )

                    // Forgot Password
                    TextButton(
                        onClick = { /* Handle forgot password */ },
                        modifier = Modifier.align(Alignment.Companion.End)
                    ) {
                        Text(
                            text = "Forgot your Password?",
                            color = Color.Companion.Gray
                        )
                    }

                    // Sign In Button
                    Button(
                        onClick = {
                            navController.navigate(Screen.HomeScreen)
//                            viewModel.loginUser(email, password)
                        },
                        modifier = Modifier
                            .fillMaxWidth(.95f)
                            .padding(vertical = 16.dp)
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF4CAF50)
                        ),
                        shape = RoundedCornerShape(8.dp),
//                        enabled = loginState.value !is LoginState.Loading
                    ) {
//                        if (loginState.value is LoginState.Loading) {
//                            CircularProgressIndicator(
//                                modifier = Modifier.size(24.dp),
//                                color = Color.White
//                            )
//                        } else {
                            Text("Sign In")
//                        }
                    }

                    // Social Login Buttons
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 16.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        SocialLoginButton(
                            icon = R.drawable.search,
                            onClick = {
                                // Handle Google Sign In
                            }
                        )
                    }

                    // Sign Up Link
                    Row(
                        modifier = Modifier.padding(top = 16.dp),
                        verticalAlignment = Alignment.Companion.CenterVertically
                    ) {
                        Text(
                            text = "You don't have an account? ",
                            fontSize = 14.sp,
                            color = Color.Companion.Gray
                        )
                        TextButton(
                            onClick = {
                                navController.navigate(Screen.RegistrationScreen)
                            }
                        ) {
                            Text(
                                text = "Sign Up!",
                                color = Color(0xFF4CAF50),
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
        }

        // Snackbar
        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Composable
fun SocialLoginButton(
    icon: Int,
    onClick: () -> Unit
)  {
    Image(
        painter = painterResource(id =R.drawable.search),
        contentDescription = "Social Login",
        modifier = Modifier.size(40.dp)
    )

}