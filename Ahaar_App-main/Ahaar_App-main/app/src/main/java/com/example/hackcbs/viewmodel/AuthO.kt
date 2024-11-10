//package com.example.hackcbs.viewmodel
//
//
//// Security Configuration
//import org.springframework.security.config.annotation.web.builders.HttpSecurity
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
//import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator
//import org.springframework.security.oauth2.jwt.*
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
//import org.springframework.context.annotation.Configuration
//import org.springframework.context.annotation.Bean
//
//@Configuration
//@EnableWebSecurity
//class SecurityConfig : WebSecurityConfigurerAdapter() {
//    @Value("\${auth0.audience}")
//    private lateinit var audience: String
//
//    @Value("\${auth0.domain}")
//    private lateinit var domain: String
//
//    override fun configure(http: HttpSecurity) {
//        http.authorizeRequests()
//            .antMatchers("/api/public").permitAll()
//            .antMatchers("/api/private").authenticated()
//            .antMatchers("/api/private-scoped").hasAuthority("read:messages")
//            .and()
//            .oauth2ResourceServer()
//            .jwt()
//            .decoder(jwtDecoder())
//            .jwtAuthenticationConverter(jwtAuthenticationConverter())
//    }
//
//    @Bean
//    fun jwtDecoder(): JwtDecoder {
//        val issuer = "https://$domain/"
//        val audience = audience
//        val provider = JwkProviderBuilder(domain)
//            .cached(10, 24, TimeUnit.HOURS)
//            .rateLimited(10, 1, TimeUnit.MINUTES)
//            .build()
//
//        val audienceValidator = AudienceValidator(audience)
//        val withIssuer = JwtValidators.createDefaultWithIssuer(issuer)
//        val withAudience = DelegatingOAuth2TokenValidator(withIssuer, audienceValidator)
//
//        val jwtDecoder = NimbusJwtDecoder.withJwkSetUri(issuer + ".well-known/jwks.json")
//            .build()
//        jwtDecoder.setJwtValidator(withAudience)
//
//        return jwtDecoder
//    }
//
//    @Bean
//    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
//        val converter = JwtAuthenticationConverter()
//        converter.setJwtGrantedAuthoritiesConverter(JwtGrantedAuthoritiesConverter())
//        return converter
//    }
//}
//
//// Custom Audience Validator
//class AudienceValidator(private val audience: String) : OAuth2TokenValidator<Jwt> {
//    override fun validate(jwt: Jwt): OAuth2TokenValidatorResult {
//        val audiences = jwt.audience
//        if (audiences.contains(audience)) {
//            return OAuth2TokenValidatorResult.success()
//        }
//        return OAuth2TokenValidatorResult.failure(
//            OAuth2Error("invalid_token", "The required audience is missing", null)
//        )
//    }
//}
//
//// Auth0 Service
//@Service
//class Auth0Service {
//    @Value("\${auth0.domain}")
//    private lateinit var domain: String
//
//    @Value("\${auth0.clientId}")
//    private lateinit var clientId: String
//
//    @Value("\${auth0.clientSecret}")
//    private lateinit var clientSecret: String
//
//    private lateinit var auth0Client: Auth0Client
//
//    @PostConstruct
//    fun init() {
//        auth0Client = Auth0Client.create(
//            Auth0ClientOptions(domain, clientId, clientSecret)
//        )
//    }
//
//    fun getManagementApiToken(): String {
//        return auth0Client.getManagementApiToken().accessToken
//    }
//
//    suspend fun getUserProfile(userId: String): UserProfile {
//        val token = getManagementApiToken()
//        return auth0Client.users().get(userId, token)
//    }
//
//    suspend fun updateUserMetadata(userId: String, metadata: Map<String, Any>) {
//        val token = getManagementApiToken()
//        auth0Client.users().update(userId, UserUpdateRequest().apply {
//            userMetadata = metadata
//        }, token)
//    }
//}
//
//// Controller Examples
//@RestController
//@RequestMapping("/api")
//class AuthController(private val auth0Service: Auth0Service) {
//
//    @GetMapping("/public")
//    fun publicEndpoint(): String {
//        return "This is a public endpoint"
//    }
//
//    @GetMapping("/private")
//    fun privateEndpoint(@AuthenticationPrincipal principal: Jwt): String {
//        return "This is a private endpoint. User ID: ${principal.subject}"
//    }
//
//    @GetMapping("/private-scoped")
//    fun privateScopedEndpoint(@AuthenticationPrincipal principal: Jwt): String {
//        return "This is a private endpoint requiring specific scope. User ID: ${principal.subject}"
//    }
//
//    @GetMapping("/user-profile")
//    suspend fun getUserProfile(@AuthenticationPrincipal principal: Jwt): UserProfile {
//        return auth0Service.getUserProfile(principal.subject)
//    }
//}
//
//// User Profile Data Class
//data class UserProfile(
//    val userId: String,
//    val email: String,
//    val emailVerified: Boolean,
//    val name: String,
//    val nickname: String,
//    val picture: String,
//    val updatedAt: String,
//    val userMetadata: Map<String, Any>? = null,
//    val appMetadata: Map<String, Any>? = null
//)