package com.ttsapp.dto;

import com.ttsapp.entity.TextEntry;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TextEntryResponse {
    private Long id;
    private String title;
    private String content;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private String audioUrl;
    
    public static TextEntryResponse fromEntity(TextEntry entry) {
        return TextEntryResponse.builder()
                .id(entry.getId())
                .title(entry.getTitle())
                .content(entry.getContent())
                .userId(entry.getUser().getId())
                .username(entry.getUser().getUsername())
                .createdAt(entry.getCreatedAt())
                .audioUrl(entry.getAudioUrl())
                .build();
    }
}

