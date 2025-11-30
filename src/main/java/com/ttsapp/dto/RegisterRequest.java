package com.ttsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "El nombre de usuario es obligatorio. Por favor, ingresa un nombre de usuario.")
    @Size(min = 2, max = 50, message = "El nombre de usuario debe tener entre 2 y 50 caracteres. Intenta con un nombre más corto o más largo.")
    private String username;
    
    @NotBlank(message = "El correo electrónico es obligatorio. Por favor, ingresa un correo (puede ser inventado).")
    @Size(min = 3, message = "El correo debe tener al menos 3 caracteres.")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria. Por favor, ingresa una contraseña.")
    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres. Intenta con una contraseña más larga.")
    private String password;
}

