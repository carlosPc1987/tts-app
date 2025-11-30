package com.ttsapp.mapper;

import com.ttsapp.dto.UserResponse;
import com.ttsapp.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting User entities to UserResponse DTOs.
 * Follows Single Responsibility Principle - only handles mapping.
 */
@Component
public class UserMapper {
    
    /**
     * Convert User entity to UserResponse DTO.
     * @param user User entity
     * @return UserResponse DTO
     */
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        
        try {
            long textEntriesCount = 0;
            if (user.getTextEntries() != null) {
                textEntriesCount = user.getTextEntries().size();
            }
            
            return UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole() != null ? user.getRole().name() : "USER")
                    .createdAt(user.getCreatedAt())
                    .textEntriesCount(textEntriesCount)
                    .build();
        } catch (Exception e) {
            System.err.println("Error mapping User to UserResponse for user: " + 
                    (user != null ? user.getUsername() : "null") + " - " + e.getMessage());
            // Return minimal response on error
            return UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole() != null ? user.getRole().name() : "USER")
                    .createdAt(user.getCreatedAt())
                    .textEntriesCount(0L)
                    .build();
        }
    }
    
    /**
     * Convert list of User entities to list of UserResponse DTOs.
     * @param users List of User entities
     * @return List of UserResponse DTOs
     */
    public List<UserResponse> toResponseList(List<User> users) {
        if (users == null || users.isEmpty()) {
            return new java.util.ArrayList<>();
        }
        
        return users.stream()
                .map(this::toResponse)
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }
}

