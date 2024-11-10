//
//package com.example.hackcbs.viewmodel
//
//import androidx.lifecycle.ViewModel
//import androidx.lifecycle.viewModelScope
//import com.google.firebase.auth.FirebaseAuth
//import com.google.firebase.firestore.FirebaseFirestore
//import kotlinx.coroutines.flow.MutableStateFlow
//import kotlinx.coroutines.flow.StateFlow
//import kotlinx.coroutines.launch
//import kotlinx.coroutines.tasks.await
//
//sealed class RegistrationState {
//    object Idle : RegistrationState()
//    object Loading : RegistrationState()
//    data class Success(val message: String) : RegistrationState()
//    data class Error(val message: String) : RegistrationState()
//}
//
//sealed class LoginState {
//    object Idle : LoginState()
//    object Loading : LoginState()
//    data class Success(val message: String) : LoginState()
//    data class Error(val message: String) : LoginState()
//}
//
//class LoginViewModel : ViewModel() {
//    private val auth = FirebaseAuth.getInstance()
//
//    private val _loginState = MutableStateFlow<LoginState>(LoginState.Idle)
//    val loginState: StateFlow<LoginState> = _loginState
//
//    fun loginUser(email: String, password: String) {
//        viewModelScope.launch {
//            try {
//                _loginState.value = LoginState.Loading
//
//                // Attempt to sign in with email and password
//                auth.signInWithEmailAndPassword(email, password).await()
//
//                _loginState.value = LoginState.Success("Login successful!")
//
//            } catch (e: Exception) {
//                _loginState.value = LoginState.Error(
//                    when {
//                        e.message?.contains("password is invalid") == true ->
//                            "Invalid password"
//                        e.message?.contains("no user record") == true ->
//                            "No account found with this email"
//                        e.message?.contains("badly formatted") == true ->
//                            "Please enter a valid email address"
//                        else -> e.message ?: "Login failed"
//                    }
//                )
//            }
//        }
//    }
//
//    fun resetLoginState() {
//        _loginState.value = LoginState.Idle
//    }
//}
//
//class RegistrationViewModel : ViewModel() {
//    private val auth = FirebaseAuth.getInstance()
//    private val firestore = FirebaseFirestore.getInstance()
//
//    private val _registrationState = MutableStateFlow<RegistrationState>(RegistrationState.Idle)
//    val registrationState: StateFlow<RegistrationState> = _registrationState
//
//    fun registerUser(email: String, password: String, name: String) {
//        viewModelScope.launch {
//            try {
//                _registrationState.value = RegistrationState.Loading
//
//                // Create user with email and password
//                val authResult = auth.createUserWithEmailAndPassword(email, password).await()
//
//                // Store user data in Firestore
//                val userId = authResult.user?.uid ?: throw Exception("User ID not found")
//                val userData = hashMapOf(
//                    "name" to name,
//                    "email" to email,
//                    "createdAt" to System.currentTimeMillis()
//                )
//
//                firestore.collection("users").document(userId).set(userData).await()
//
//                _registrationState.value = RegistrationState.Success("Registration successful!")
//
//            } catch (e: Exception) {
//                _registrationState.value = RegistrationState.Error(
//                    when {
//                        e.message?.contains("email address is already in use") == true ->
//                            "This email is already registered"
//                        e.message?.contains("password is invalid") == true ->
//                            "Password should be at least 6 characters"
//                        e.message?.contains("badly formatted") == true ->
//                            "Please enter a valid email address"
//                        else -> e.message ?: "Registration failed"
//                    }
//                )
//            }
//        }
//    }
//
//    fun resetRegistrationState() {
//        _registrationState.value = RegistrationState.Idle
//    }
//}
