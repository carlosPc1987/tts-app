package com.ttsapp.service;

import com.ttsapp.dto.UserResponse;
import com.ttsapp.entity.User;

import java.util.List;

/**
 * Interface for user query operations (read-only).
 * Follows Interface Segregation Principle.
 */
public interface UserQueryService {
    /**
     * Get all users as DTOs for admin view.
     * @return List of UserResponse DTOs
     */
    List<UserResponse> getAllUsers();
    
    /**
     * Get user by ID.
     * @param id User ID
     * @return User entity or null
     */
    User getUserById(Long id);
    
    /**
     * Get user by username.
     * @param username Username
     * @return User entity or null
     */
    User getUserByUsername(String username);
    
    /**
     * Get current authenticated user.
     * @return User entity
     */
    User getCurrentUser();
    
    /**
     * Get total user count.
     * @return Total number of users
     */
    long getUserCount();
    
    /**
     * Get all users as raw entities (for debugging).
     * @return List of User entities
     */
    List<User> getAllUsersRaw();
}

