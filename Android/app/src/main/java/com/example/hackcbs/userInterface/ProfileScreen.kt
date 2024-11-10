package com.example.hackcbs.userInterface

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController


@Composable
fun UserProfileScreen(navController: NavController) {
    var isEditing by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NutritionsColors.Background)
            .padding(top = 60.dp, start = 25.dp, end = 25.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Profile Header
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = NutritionsColors.Surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(start = 16.dp, top = 16.dp, end = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Profile Picture
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .align(Alignment.CenterHorizontally)
                        .background(NutritionsColors.PrimaryContainer)
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Profile Picture",
                        modifier = Modifier
                            .size(60.dp)
                            .align(Alignment.Center),
                        tint = NutritionsColors.Primary
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Satyam Kumar",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Text(
                    text = "Health Enthusiast",
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Profile Information
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = NutritionsColors.Surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                ProfileInfoItem(
                    icon = Icons.Default.Email,
                    label = "Email",
                    value = "satyam@gmail.com",
                    isEditing = isEditing
                )

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                ProfileInfoItem(
                    icon = Icons.Default.Phone,
                    label = "Phone",
                    value = "+917267006722",
                    isEditing = isEditing
                )

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                ProfileInfoItem(
                    icon = Icons.Default.LocationOn,
                    label = "Location",
                    value = "Delhi, India",
                    isEditing = isEditing
                )

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                ProfileInfoItem(
                    icon = Icons.Default.CalendarToday,
                    label = "Member Since",
                    value = "January 2024",
                    isEditing = false
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Edit Button
        Button(
            onClick = { isEditing = !isEditing },
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isEditing) NutritionsColors.Secondary else NutritionsColors.Primary
            ),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            Icon(
                imageVector = if (isEditing) Icons.Default.Done else Icons.Default.Edit,
                contentDescription = if (isEditing) "Save" else "Edit"
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(text = if (isEditing) "Save Profile" else "Edit Profile")
        }
    }
}

@Composable
private fun ProfileInfoItem(
    icon: ImageVector,
    label: String,
    value: String,
    isEditing: Boolean
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = NutritionsColors.Primary,
            modifier = Modifier.size(24.dp)
        )

        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text(
                text = label,
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (isEditing && label != "Member Since") {
                TextField(
                    value = value,
                    onValueChange = { /* Handle value change */ },
                    colors = TextFieldDefaults.colors(
                        unfocusedContainerColor = NutritionsColors.PrimaryContainer,
                        focusedContainerColor = NutritionsColors.PrimaryContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            } else {
                Text(
                    text = value,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}