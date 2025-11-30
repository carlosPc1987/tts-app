package com.ttsapp.service;

import com.ttsapp.dto.TextEntryRequest;
import com.ttsapp.dto.TextEntryResponse;
import com.ttsapp.entity.TextEntry;
import com.ttsapp.entity.User;
import com.ttsapp.repository.TextEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TextEntryService {
    
    private final TextEntryRepository textEntryRepository;
    private final TtsService ttsService;
    private final UserQueryService userQueryService;
    
    @Transactional
    public TextEntryResponse createTextEntry(TextEntryRequest request) {
        System.out.println("=== INICIO createTextEntry ===");
        System.out.println("Título: " + request.getTitle());
        System.out.println("Contenido length: " + (request.getContent() != null ? request.getContent().length() : "null"));
        System.out.println("Voz: " + request.getVoice());
        
        User currentUser = userQueryService.getCurrentUser();
        System.out.println("Usuario actual: " + currentUser.getUsername());
        
        try {
            System.out.println("Generando audio...");
            byte[] audioData = ttsService.generateAudio(request.getContent(), request.getVoice());
            System.out.println("Audio generado, tamaño: " + (audioData != null ? audioData.length : "null") + " bytes");
            
            System.out.println("Guardando audio...");
            String audioUrl = ttsService.saveAudio(audioData);
            System.out.println("Audio guardado en: " + audioUrl);
            
            System.out.println("Creando entrada de texto...");
            TextEntry entry = TextEntry.builder()
                    .title(request.getTitle())
                    .content(request.getContent())
                    .user(currentUser)
                    .audioUrl(audioUrl)
                    .build();
            
            System.out.println("Guardando en base de datos...");
            // Usar saveAndFlush para asegurar persistencia inmediata
            entry = textEntryRepository.saveAndFlush(entry);
            System.out.println("Entrada guardada con ID: " + entry.getId());
            System.out.println("✅ Texto persistido inmediatamente en BD");
            
            TextEntryResponse response = TextEntryResponse.fromEntity(entry);
            System.out.println("Respuesta creada - ID: " + response.getId() + ", audioUrl: " + response.getAudioUrl());
            System.out.println("=== FIN createTextEntry ===");
            
            return response;
        } catch (Exception e) {
            System.err.println("ERROR en createTextEntry: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public List<TextEntryResponse> getUserTextEntries() {
        User currentUser = userQueryService.getCurrentUser();
        return textEntryRepository.findByUser(currentUser).stream()
                .map(TextEntryResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public TextEntryResponse getTextEntry(Long id) {
        User currentUser = userQueryService.getCurrentUser();
        TextEntry entry = textEntryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Text entry not found"));
        return TextEntryResponse.fromEntity(entry);
    }
    
    @Transactional
    public TextEntryResponse updateTextEntry(Long id, TextEntryRequest request) {
        System.out.println("=== INICIO updateTextEntry (Service) ===");
        System.out.println("ID: " + id);
        System.out.println("Request: " + (request != null ? "NOT NULL" : "NULL"));
        if (request != null) {
            System.out.println("Título: " + request.getTitle());
            System.out.println("Contenido length: " + (request.getContent() != null ? request.getContent().length() : "null"));
            System.out.println("Voz: " + request.getVoice());
        }
        
        User currentUser = userQueryService.getCurrentUser();
        System.out.println("Usuario actual: " + currentUser.getUsername());
        
        TextEntry entry = textEntryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> {
                    System.err.println("ERROR: Text entry no encontrado - ID: " + id + ", Usuario: " + currentUser.getUsername());
                    return new RuntimeException("Text entry not found");
                });
        
        System.out.println("Entrada encontrada - ID: " + entry.getId() + ", Título actual: " + entry.getTitle());
        
        // Verificar si el contenido o la voz cambiaron (necesitamos regenerar audio)
        boolean contentChanged = !entry.getContent().equals(request.getContent());
        String currentVoice = request.getVoice() != null ? request.getVoice() : "es-ES-ElviraNeural";
        // Nota: No tenemos la voz guardada en la entrada, así que siempre regeneramos si el contenido cambió
        // O si se especifica una voz diferente
        
        System.out.println("Comparando contenido:");
        System.out.println("  Contenido actual length: " + entry.getContent().length());
        System.out.println("  Contenido nuevo length: " + (request.getContent() != null ? request.getContent().length() : "null"));
        System.out.println("  Contenido cambió: " + contentChanged);
        
        // Siempre regenerar audio (porque no guardamos la voz original)
        // Esto asegura que el audio coincida con el contenido y voz actuales
        System.out.println("Regenerando audio con nuevo contenido y voz...");
        try {
            byte[] audioData = ttsService.generateAudio(request.getContent(), currentVoice);
            System.out.println("Audio regenerado, tamaño: " + (audioData != null ? audioData.length : "null") + " bytes");
            
            // Eliminar el audio anterior si existe
            if (entry.getAudioUrl() != null) {
                try {
                    ttsService.deleteAudioFile(entry.getAudioUrl());
                    System.out.println("Audio anterior eliminado: " + entry.getAudioUrl());
                } catch (Exception e) {
                    System.err.println("No se pudo eliminar el audio anterior: " + e.getMessage());
                }
            }
            
            String audioUrl = ttsService.saveAudio(audioData);
            System.out.println("Nuevo audio guardado en: " + audioUrl);
            entry.setAudioUrl(audioUrl);
        } catch (Exception e) {
            System.err.println("ERROR al regenerar audio: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al regenerar audio: " + e.getMessage(), e);
        }
        
        // SIEMPRE actualizar título y contenido (esto es lo que el usuario quiere cambiar)
        System.out.println("Actualizando título y contenido...");
        System.out.println("  Título anterior: " + entry.getTitle());
        System.out.println("  Título nuevo: " + request.getTitle());
        System.out.println("  Contenido anterior length: " + entry.getContent().length());
        System.out.println("  Contenido nuevo length: " + (request.getContent() != null ? request.getContent().length() : "null"));
        
        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        
        System.out.println("Título y contenido actualizados en el objeto entry");
        
        System.out.println("Guardando cambios en base de datos...");
        // Usar saveAndFlush para asegurar persistencia inmediata
        entry = textEntryRepository.saveAndFlush(entry);
        System.out.println("Entrada guardada - ID: " + entry.getId());
        System.out.println("✅ Texto actualizado persistido inmediatamente en BD");
        
        // Verificar que se guardó correctamente
        TextEntry savedEntry = textEntryRepository.findById(entry.getId()).orElse(null);
        if (savedEntry != null) {
            System.out.println("✅ Verificación - Título guardado: " + savedEntry.getTitle());
            System.out.println("✅ Verificación - Contenido guardado length: " + savedEntry.getContent().length());
            System.out.println("✅ Verificación - AudioUrl guardado: " + savedEntry.getAudioUrl());
        } else {
            System.err.println("❌ ERROR: No se pudo verificar la entrada guardada!");
        }
        
        TextEntryResponse response = TextEntryResponse.fromEntity(entry);
        System.out.println("Respuesta creada - ID: " + response.getId() + ", Título: " + response.getTitle() + ", audioUrl: " + response.getAudioUrl());
        System.out.println("=== FIN updateTextEntry ===");
        
        return response;
    }
    
    @Transactional
    public void deleteTextEntry(Long id) {
        User currentUser = userQueryService.getCurrentUser();
        TextEntry entry = textEntryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Text entry not found"));
        textEntryRepository.delete(entry);
    }
    
    public List<TextEntryResponse> getAllTextEntries() {
        return textEntryRepository.findAll().stream()
                .map(TextEntryResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteTextEntryAsAdmin(Long id) {
        TextEntry entry = textEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Text entry not found"));
        textEntryRepository.delete(entry);
    }
}

