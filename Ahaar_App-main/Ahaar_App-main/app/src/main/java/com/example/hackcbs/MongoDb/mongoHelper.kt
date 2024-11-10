package com.example.hackcbs.MongoDb


//// MongoDB Configuration and Database Helper
//import com.mongodb.ConnectionString
//import com.mongodb.MongoClientSettings
//import com.mongodb.kotlin.client.coroutine.MongoClient
//import com.mongodb.kotlin.client.coroutine.MongoDatabase
//import kotlinx.coroutines.flow.firstOrNull
//import kotlinx.coroutines.flow.toList
//import org.bson.Document
//import kotlinx.serialization.Serializable
//
//@Serializable
//data class User(
//    val id: String,
//    val name: String,
//    val email: String,
//    val age: Int
//)
//
//class MongoDBConfig {
//    companion object {
//        private const val CONNECTION_STRING = "mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
//        private const val DATABASE_NAME = "your_database"
//
//        private val client = MongoClient.create(
//            MongoClientSettings.builder()
//                .applyConnectionString(ConnectionString(CONNECTION_STRING))
//                .build()
//        )
//
//        val database: MongoDatabase = client.getDatabase(DATABASE_NAME)
//    }
//}
//
//class UserRepository {
//    private val collection = MongoDBConfig.database.getCollection<User>("users")
//
//    suspend fun create(user: User) {
//        collection.insertOne(user)
//    }
//
//    suspend fun findById(id: String): User? {
//        return collection.find(Document("id", id)).firstOrNull()
//    }
//
//    suspend fun findAll(): List<User> {
//        return collection.find().toList()
//    }
//
//    suspend fun update(user: User) {
//        collection.replaceOne(Document("id", user.id), user)
//    }
//
//    suspend fun delete(id: String) {
//        collection.deleteOne(Document("id", id))
//    }
//}
//
//// Example Usage
//suspend fun main() {
//    val userRepository = UserRepository()
//
//    // Create a new user
//    val newUser = User(
//        id = "1",
//        name = "John Doe",
//        email = "john@example.com",
//        age = 30
//    )
//    userRepository.create(newUser)
//
//    // Find user by ID
//    val foundUser = userRepository.findById("1")
//    println("Found user: $foundUser")
//
//    // Get all users
//    val allUsers = userRepository.findAll()
//    println("All users: $allUsers")
//
//    // Update user
//    val updatedUser = newUser.copy(name = "John Updated")
//    userRepository.update(updatedUser)
//
//    // Delete user
//    userRepository.delete("1")
//}