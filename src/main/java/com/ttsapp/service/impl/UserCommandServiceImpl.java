package com.ttsapp.service.impl;

import com.ttsapp.dto.AuthResponse;
import com.ttsapp.dto.LoginRequest;
import com.ttsapp.dto.RegisterRequest;
import com.ttsapp.entity.User;
import com.ttsapp.exception.EmailAlreadyExistsException;
import com.ttsapp.exception.UserNotFoundException;
import com.ttsapp.exception.UsernameAlreadyExistsException;
import com.ttsapp.repository.UserRepository;
import com.ttsapp.security.JwtTokenProvider;
import com.ttsapp.service.UserCommandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of UserCommandService.
 * Handles all write operations for users.
 * Follows Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserCommandServiceImpl implements UserCommandService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("=== REGISTRATION START ===");
        log.info("Username: {}, Email: {}", request.getUsername(), request.getEmail());
        
        try {
            // Check username uniqueness
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new UsernameAlreadyExistsException(
                    "El nombre de usuario '" + request.getUsername() + "' ya está en uso. Por favor, elige otro nombre de usuario diferente.");
            }
            
            // Check email uniqueness
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new EmailAlreadyExistsException(
                    "El correo '" + request.getEmail() + "' ya está registrado. Si este es tu correo, intenta iniciar sesión en lugar de registrarte.");
            }
            
            // Create new user
            log.debug("Creating new user...");
            User user = User.builder()
                    .username(request.getUsername().trim())
                    .email(request.getEmail().trim())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(User.Role.USER)
                    .textEntries(new java.util.ArrayList<>())
                    .build();
            
            // Save and flush to ensure immediate persistence
            log.debug("Saving user to database...");
            user = userRepository.saveAndFlush(user);
            log.info("User saved with ID: {}", user.getId());
            
            // Force transaction commit by accessing the repository again
            userRepository.flush();
            
            // Verify immediate persistence
            User savedUser = userRepository.findById(user.getId()).orElse(null);
            if (savedUser != null) {
                log.info("✅ User verified in DB - ID: {}, Username: {}, Email: {}", 
                    savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
            } else {
                log.error("❌ CRITICAL ERROR: User not found after saving!");
            }
            
            // Count total users after save
            long totalUsers = userRepository.count();
            log.info("Total users in DB (after save): {}", totalUsers);
            
            // List all users for debugging
            log.info("=== LISTING ALL USERS IN DB ===");
            userRepository.findAllWithoutGraph().forEach(u -> {
                log.info("  - ID: {}, Username: {}, Email: {}, Role: {}", 
                    u.getId(), u.getUsername(), u.getEmail(), u.getRole());
            });
            log.info("=== END USER LIST ===");
            
            // Build response
            AuthResponse response = AuthResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .message("Usuario registrado exitosamente")
                    .build();
            
            log.info("=== REGISTRATION SUCCESS ===");
            return response;
            
        } catch (UsernameAlreadyExistsException | EmailAlreadyExistsException e) {
            log.warn("Business error during registration: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error during registration", e);
            throw new RuntimeException("Error al registrar usuario: " + e.getMessage(), e);
        }
    }
    
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("=== LOGIN START ===");
        log.info("Username: {}", request.getUsername());
        
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            log.debug("✅ Authentication successful");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get user from database
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UserNotFoundException(
                        "Usuario no encontrado: " + request.getUsername() + ". Verifica tu nombre de usuario o regístrate si no tienes cuenta."));
            
            log.info("✅ User found - ID: {}, Username: {}, Role: {}", 
                user.getId(), user.getUsername(), user.getRole());
            
            // Generate token
            String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
            log.debug("✅ Token generated");
            
            // Small delay to ensure cookie is set
            Thread.sleep(500);
            
            // Build response
            AuthResponse response = AuthResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .message("Inicio de sesión exitoso")
                    .build();
            
            log.info("=== LOGIN SUCCESS ===");
            return response;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted during login", e);
            throw new RuntimeException("Error durante el inicio de sesión", e);
        } catch (Exception e) {
            log.error("Error during login", e);
            throw e;
        }
    }
    
    @Override
    @Transactional
    public void deleteUser(Long userId) {
        log.info("Deleting user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        userRepository.delete(user);
        log.info("User deleted successfully");
    }
}

