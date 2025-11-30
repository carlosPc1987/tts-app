package com.ttsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AudioFileInfo {
    private String filename;
    private String audioUrl;
    private String title; // Título del texto asociado
    private String username; // Usuario que creó el texto
    private Long textEntryId; // ID del texto asociado
    private LocalDateTime createdAt; // Fecha de creación
    private Long fileSize; // Tamaño del archivo en bytes
}

