package com.ttsapp.controller;

import com.ttsapp.dto.AuthResponse;
import com.ttsapp.dto.LoginRequest;
import com.ttsapp.dto.RegisterRequest;
import com.ttsapp.entity.User;
import com.ttsapp.security.JwtTokenProvider;
import com.ttsapp.service.UserCommandService;
import com.ttsapp.service.UserQueryService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserCommandService userCommandService;
    private final UserQueryService userQueryService;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, 
                                                 HttpServletResponse httpResponse) {
        System.out.println("=== INICIO REGISTRO (Controller) ===");
        System.out.println("Username: " + request.getUsername());
        System.out.println("Email: " + request.getEmail());
        
        AuthResponse response = userCommandService.register(request);
        
        System.out.println("Usuario registrado - ID: " + response.getId());
        System.out.println("=== FIN REGISTRO (Controller) ===");
        
        // Verificar que el usuario se guardó
        try {
            User savedUser = userQueryService.getUserById(response.getId());
            if (savedUser != null) {
                System.out.println("✅ Usuario verificado después de registro: " + savedUser.getUsername());
            } else {
                System.err.println("❌ ERROR: Usuario no encontrado después de registro!");
            }
        } catch (Exception e) {
            System.err.println("❌ ERROR al verificar usuario: " + e.getMessage());
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, 
                                             HttpServletResponse httpResponse) {
        AuthResponse response = userCommandService.login(request);
        
        User user = userQueryService.getCurrentUser();
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(86400);
        httpResponse.addCookie(cookie);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse httpResponse) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        httpResponse.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = userQueryService.getCurrentUser();
            AuthResponse response = AuthResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .message("Usuario actual")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}

