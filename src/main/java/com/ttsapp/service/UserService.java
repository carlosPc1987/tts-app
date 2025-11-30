package com.ttsapp.service;

import com.ttsapp.dto.AuthResponse;
import com.ttsapp.dto.LoginRequest;
import com.ttsapp.dto.RegisterRequest;
import com.ttsapp.dto.UserResponse;
import com.ttsapp.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Facade service that delegates to specialized services.
 * Follows Facade pattern and Single Responsibility Principle.
 * This service acts as a convenience wrapper for backward compatibility.
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserQueryService userQueryService;
    private final UserCommandService userCommandService;
    
    // Delegate to command service
    public AuthResponse register(RegisterRequest request) {
        return userCommandService.register(request);
    }
    
    public AuthResponse login(LoginRequest request) {
        return userCommandService.login(request);
    }
    
    public void deleteUser(Long userId) {
        userCommandService.deleteUser(userId);
    }
    
    // Delegate to query service
    public User getCurrentUser() {
        return userQueryService.getCurrentUser();
    }
    
    public List<UserResponse> getAllUsers() {
        return userQueryService.getAllUsers();
    }
    
    public long getUserCount() {
        return userQueryService.getUserCount();
    }
    
    public User getUserById(Long id) {
        return userQueryService.getUserById(id);
    }
    
    public User getUserByUsername(String username) {
        return userQueryService.getUserByUsername(username);
    }
    
    public List<UserResponse> getAllUsersDirect() {
        // Use the query service's getAllUsers which is already optimized
        return userQueryService.getAllUsers();
    }
    
    public List<User> getAllUsersRaw() {
        return userQueryService.getAllUsersRaw();
    }
}
