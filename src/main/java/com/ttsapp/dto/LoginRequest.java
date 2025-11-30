package com.ttsapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "El nombre de usuario es obligatorio. Por favor, ingresa tu nombre de usuario.")
    private String username;
    
    @NotBlank(message = "La contraseña es obligatoria. Por favor, ingresa tu contraseña.")
    private String password;
}

