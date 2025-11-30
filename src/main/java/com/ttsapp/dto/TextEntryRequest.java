package com.ttsapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TextEntryRequest {
    @NotBlank(message = "Title is required")
    @jakarta.validation.constraints.Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String voice = "es-ES-ElviraNeural";
}

