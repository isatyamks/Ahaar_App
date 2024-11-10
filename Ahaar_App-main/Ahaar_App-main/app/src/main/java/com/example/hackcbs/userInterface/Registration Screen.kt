
package com.example.hackcbs.userInterface

import Screen
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
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
import androidx.navigation.NavController
import com.example.hackcbs.R
//import com.example.hackcbs.viewmodel.RegistrationState
//import com.example.hackcbs.viewmodel.RegistrationViewModel


@Composable
fun RegistrationScreen(
//    viewModel: RegistrationViewModel,
    navController: NavController
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var showErrorDialog by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }

//    val registrationState by viewModel.registrationState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

//    LaunchedEffect(registrationState) {
//        when (registrationState) {
//            is RegistrationState.Success -> {
//                snackbarHostState.showSnackbar("Registration successful!")
//                navController.navigate(Screen.CameraScreen)
//            }
//            is RegistrationState.Error -> {
//                errorMessage = (registrationState as RegistrationState.Error).message
//                showErrorDialog = true
//            }
//            else -> {}
//        }
//    }

    Box(modifier = Modifier.fillMaxSize()) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.second_login_pageeee),
            contentDescription = "Food Background",
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 350.dp),
            contentScale = ContentScale.FillBounds
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 200.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color.White.copy(alpha = 0.9f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Sign Up",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 24.dp)
                    )

                    // Form Fields...
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Name") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        singleLine = true,
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = "Person Icon"
                            )
                        }
                    )

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
                        }
                    )

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
                        }
                    )

                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it },
                        label = { Text("Re-Enter Password") },
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
                        }
                    )

                    Button(
                        onClick = {
                            when {
                                name.isBlank() -> {
                                    errorMessage = "Please enter your name"
                                    showErrorDialog = true
                                }
                                email.isBlank() -> {
                                    errorMessage = "Please enter your email"
                                    showErrorDialog = true
                                }
                                password.isBlank() -> {
                                    errorMessage = "Please enter a password"
                                    showErrorDialog = true
                                }
                                password != confirmPassword -> {
                                    errorMessage = "Passwords do not match"
                                    showErrorDialog = true
                                }
                                else -> {
                                    navController.navigate(Screen.CameraScreen)
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth(0.95f)
                            .padding(vertical = 16.dp)
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF4CAF50)
                        )
                    ) {
//                        if (registrationState is RegistrationState.Loading) {
//                            CircularProgressIndicator(
//                                color = Color.White,
//                                modifier = Modifier.size(24.dp)
//                            )
//                        } else {
                            Text("Sign Up")
//                        }
                    }

                    Row(
                        modifier = Modifier.padding(top = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Already have an account? ",
                            fontSize = 14.sp,
                            color = Color.Gray
                        )
                        TextButton(
                            onClick = {
                                navController.navigate(Screen.LoginScreen)
                            }
                        ) {
                            Text(
                                text = "Sign In!",
                                color = Color(0xFF4CAF50),
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
        }

        if (showErrorDialog) {
            AlertDialog(
                onDismissRequest = { showErrorDialog = false },
                title = { Text("Error") },
                text = { Text(errorMessage) },
                confirmButton = {
                    TextButton(onClick = { showErrorDialog = false }) {
                        Text("OK")
                    }
                }
            )
        }

        SnackbarHost(
            hostState = snackbarHostState,
//            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}