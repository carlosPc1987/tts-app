package com.ttsapp.dto;

import com.ttsapp.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private Long textEntriesCount;

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            System.err.println("❌ ERROR: User es null en fromEntity()");
            return null;
        }
        
        try {
            long textEntriesCount = 0L;
            if (user.getTextEntries() != null) {
                textEntriesCount = (long) user.getTextEntries().size();
            }
            
            UserResponse response = UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole() != null ? user.getRole().name() : "USER")
                    .createdAt(user.getCreatedAt())
                    .textEntriesCount(textEntriesCount)
                    .build();
            
            System.out.println("    UserResponse construido: ID=" + response.getId() + ", Username=" + response.getUsername());
            return response;
        } catch (Exception e) {
            System.err.println("❌ ERROR al construir UserResponse: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}

