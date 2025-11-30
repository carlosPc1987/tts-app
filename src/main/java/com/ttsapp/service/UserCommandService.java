package com.ttsapp.service;

import com.ttsapp.dto.AuthResponse;
import com.ttsapp.dto.LoginRequest;
import com.ttsapp.dto.RegisterRequest;

/**
 * Interface for user command operations (write operations).
 * Follows Interface Segregation Principle.
 */
public interface UserCommandService {
    /**
     * Register a new user.
     * @param request Registration request
     * @return AuthResponse with user details
     */
    AuthResponse register(RegisterRequest request);
    
    /**
     * Authenticate and login user.
     * @param request Login request
     * @return AuthResponse with user details
     */
    AuthResponse login(LoginRequest request);
    
    /**
     * Delete a user by ID.
     * @param userId User ID to delete
     */
    void deleteUser(Long userId);
}

