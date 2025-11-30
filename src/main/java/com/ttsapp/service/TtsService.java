package com.ttsapp.service;

import com.ttsapp.dto.AudioFileInfo;
import com.ttsapp.entity.TextEntry;
import com.ttsapp.repository.TextEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TtsService {
    
    private static final String GOOGLE_TTS_URL = "https://translate.google.com/translate_tts";
    private static final String UPLOAD_DIR = "uploads/audio";
    private final TextEntryRepository textEntryRepository;
    
    // WebClient se inicializa después de crear el directorio
    private final WebClient webClient = WebClient.builder()
            .defaultHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .defaultHeader(HttpHeaders.ACCEPT, "audio/mpeg, audio/*, */*")
            .defaultHeader(HttpHeaders.ACCEPT_LANGUAGE, "en-US,en;q=0.9")
            .build();
    
    // Inicializar directorio al construir el bean
    {
        createUploadDirectory();
    }
    
    private void createUploadDirectory() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory", e);
        }
    }
    
    public byte[] generateAudio(String text, String voice) {
        try {
            log.info("Generating audio for text length: {}, voice: {}", text.length(), voice);
            
            String lang = getLangFromVoice(voice);
            String ttsVoice = getGoogleTtsVoice(voice);
            
            if (text.length() > 200) {
                return generateLongAudio(text, lang, ttsVoice);
            }
            
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
            String speed = getSpeedFromVoice(voice);
            String url = String.format(
                "%s?ie=UTF-8&q=%s&tl=%s&client=tw-ob&ttsspeed=%s",
                GOOGLE_TTS_URL,
                encodedText,
                lang,
                speed
            );
            
            log.debug("Requesting TTS from Google: {}", url);
            
            byte[] audioData = webClient.get()
                    .uri(URI.create(url))
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .block();
            
            if (audioData == null || audioData.length == 0) {
                log.error("Empty audio response from TTS service for text: {}", text.substring(0, Math.min(50, text.length())));
                throw new RuntimeException("Empty audio response from TTS service");
            }
            
            if (audioData.length < 1024) {
                log.warn("Audio muy pequeño ({} bytes), puede estar corrupto", audioData.length);
            }
            
            boolean isValidAudio = false;
            if (audioData.length >= 3) {
                String header = new String(audioData, 0, Math.min(4, audioData.length), StandardCharsets.ISO_8859_1);
                if (header.startsWith("ID3") || header.startsWith("RIFF") || 
                    (audioData[0] == (byte)0xFF && (audioData[1] & 0xE0) == 0xE0)) {
                    isValidAudio = true;
                }
            }
            
            if (!isValidAudio && audioData.length > 0) {
                log.warn("Audio puede no tener formato válido. Tamaño: {} bytes", audioData.length);
            }
            
            log.info("Audio generated successfully: {} bytes, válido: {}", audioData.length, isValidAudio);
            return audioData;
            
        } catch (Exception e) {
            log.error("Error generating audio", e);
            throw new RuntimeException("Failed to generate audio: " + e.getMessage(), e);
        }
    }
    
    private byte[] generateLongAudio(String text, String lang, String voiceName) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            int chunkSize = 200;
            
            for (int i = 0; i < text.length(); i += chunkSize) {
                int end = Math.min(i + chunkSize, text.length());
                String chunk = text.substring(i, end);
                
                String encodedChunk = URLEncoder.encode(chunk, StandardCharsets.UTF_8);
                String speed = getSpeedFromVoice(voiceName);
                String url = String.format(
                    "%s?ie=UTF-8&q=%s&tl=%s&client=tw-ob&ttsspeed=%s",
                    GOOGLE_TTS_URL,
                    encodedChunk,
                    lang,
                    speed
                );
                
                byte[] chunkData = webClient.get()
                        .uri(URI.create(url))
                        .retrieve()
                        .bodyToMono(byte[].class)
                        .block();
                
                if (chunkData != null && chunkData.length > 0) {
                    outputStream.write(chunkData);
                    Thread.sleep(100);
                }
            }
            
            return outputStream.toByteArray();
        } catch (Exception e) {
            log.error("Error generating long audio", e);
            throw new RuntimeException("Failed to generate long audio: " + e.getMessage(), e);
        }
    }
    
    private String getLangFromVoice(String voice) {
        if (voice.startsWith("es-")) return "es";
        if (voice.startsWith("en-")) return "en";
        return "en"; // default
    }
    
    private String getGoogleTtsVoice(String voice) {
        if (voice.startsWith("es-")) return "es-ES";
        if (voice.startsWith("en-")) return "en-US";
        return "en-US";
    }

    private String getSpeedFromVoice(String voice) {
        if (voice.contains("Alvaro") || voice.contains("Davis") || voice.contains("Guy")) {
            return "0.8";
        }
        if (voice.contains("Nuria") || voice.contains("Triana") || voice.contains("Jenny")) {
            return "1.2";
        }
        return "1.0";
    }
    
    public String saveAudio(byte[] audioData) {
        try {
            String filename = UUID.randomUUID().toString() + ".mp3";
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            
            Files.write(filePath, audioData);
            
            log.info("Audio saved: {}", filename);
            return "/uploads/audio/" + filename;
        } catch (IOException e) {
            log.error("Error saving audio file", e);
            throw new RuntimeException("Failed to save audio file: " + e.getMessage());
        }
    }

    public void deleteAudioFile(String audioUrl) {
        try {
            if (audioUrl == null || audioUrl.isEmpty()) {
                return;
            }
            
            String filename = audioUrl.substring(audioUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Audio file deleted: {}", filename);
            } else {
                log.warn("Audio file not found: {}", filename);
            }
        } catch (IOException e) {
            log.error("Error deleting audio file: {}", audioUrl, e);
            throw new RuntimeException("Failed to delete audio file: " + e.getMessage());
        }
    }

    public List<String> getAllAudioFiles() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                return java.util.Collections.emptyList();
            }
            
            return Files.list(uploadPath)
                    .filter(Files::isRegularFile)
                    .map(path -> "/uploads/audio/" + path.getFileName().toString())
                    .collect(java.util.stream.Collectors.toList());
        } catch (IOException e) {
            log.error("Error listing audio files", e);
            return java.util.Collections.emptyList();
        }
    }

    public List<AudioFileInfo> getAllAudioFilesWithInfo() {
        try {
            log.info("=== TtsService.getAllAudioFilesWithInfo() ===");
            
            // Obtener TODOS los textos con la relación User cargada usando EntityGraph
            List<TextEntry> allTextEntries = textEntryRepository.findAllWithUser();
            log.info("Total text entries in DB: {}", allTextEntries.size());
            
            // Filtrar los que tienen audioUrl
            List<TextEntry> textEntries = allTextEntries.stream()
                    .filter(entry -> {
                        boolean hasAudioUrl = entry.getAudioUrl() != null && !entry.getAudioUrl().isEmpty();
                        if (!hasAudioUrl) {
                            log.debug("TextEntry {} (title: {}) has no audioUrl", entry.getId(), entry.getTitle());
                        }
                        return hasAudioUrl;
                    })
                    .collect(Collectors.toList());
            
            log.info("Found {} text entries with audioUrl (out of {})", textEntries.size(), allTextEntries.size());
            
            if (textEntries.isEmpty()) {
                log.warn("No text entries with audioUrl found!");
                if (!allTextEntries.isEmpty()) {
                    log.warn("But there are {} text entries without audioUrl", allTextEntries.size());
                    allTextEntries.forEach(entry -> {
                        log.warn("  - TextEntry ID: {}, Title: {}, AudioUrl: {}", 
                            entry.getId(), entry.getTitle(), entry.getAudioUrl());
                    });
                }
                return java.util.Collections.emptyList();
            }
            
            // Crear un mapa de archivos físicos si el directorio existe
            java.util.Map<String, Long> physicalFiles = new java.util.HashMap<>();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (Files.exists(uploadPath)) {
                try {
                    Files.list(uploadPath)
                            .filter(Files::isRegularFile)
                            .forEach(path -> {
                                try {
                                    String filename = path.getFileName().toString();
                                    String audioUrl = "/uploads/audio/" + filename;
                                    long fileSize = Files.size(path);
                                    physicalFiles.put(audioUrl, fileSize);
                                } catch (IOException e) {
                                    log.warn("Error getting file size for: {}", path.getFileName(), e);
                                }
                            });
                } catch (IOException e) {
                    log.warn("Error listing physical files", e);
                }
            }
            
            log.info("Found {} physical files in directory", physicalFiles.size());
            
            // Crear AudioFileInfo para cada TextEntry con audioUrl
            List<AudioFileInfo> result = new java.util.ArrayList<>();
            for (TextEntry textEntry : textEntries) {
                try {
                    String audioUrl = textEntry.getAudioUrl();
                    log.debug("Processing TextEntry ID: {}, Title: {}, AudioUrl: {}", 
                        textEntry.getId(), textEntry.getTitle(), audioUrl);
                    
                    String filename = audioUrl.substring(audioUrl.lastIndexOf("/") + 1);
                    Long fileSize = physicalFiles.get(audioUrl);
                    
                    // Si el archivo físico no existe, usar 0 como tamaño
                    if (fileSize == null) {
                        log.warn("Physical file not found for audioUrl: {} (but TextEntry exists)", audioUrl);
                        fileSize = 0L;
                    } else {
                        log.debug("Physical file found: {} (size: {} bytes)", filename, fileSize);
                    }
                    
                    // Obtener username de forma segura (User ya está cargado por @EntityGraph)
                    String username = "(Desconocido)";
                    try {
                        if (textEntry.getUser() != null) {
                            username = textEntry.getUser().getUsername();
                            log.debug("Username for TextEntry {}: {}", textEntry.getId(), username);
                        } else {
                            log.warn("TextEntry {} has no user associated", textEntry.getId());
                        }
                    } catch (Exception e) {
                        log.error("Error getting username for TextEntry {}", textEntry.getId(), e);
                        e.printStackTrace();
                    }
                    
                    // Obtener fecha de forma segura
                    java.time.LocalDateTime createdAt = textEntry.getCreatedAt();
                    if (createdAt == null) {
                        log.warn("TextEntry {} has no createdAt date", textEntry.getId());
                    } else {
                        log.debug("CreatedAt for TextEntry {}: {}", textEntry.getId(), createdAt);
                    }
                    
                    log.debug("Creating AudioFileInfo: filename={}, title={}, username={}", 
                        filename, textEntry.getTitle(), username);
                    
                    AudioFileInfo info = AudioFileInfo.builder()
                            .filename(filename)
                            .audioUrl(audioUrl)
                            .title(textEntry.getTitle())
                            .username(username)
                            .textEntryId(textEntry.getId())
                            .createdAt(textEntry.getCreatedAt())
                            .fileSize(fileSize)
                            .build();
                    
                    result.add(info);
                    log.info("✅ AudioFileInfo created: {} - {} (user: {}, date: {})", 
                        filename, textEntry.getTitle(), username, textEntry.getCreatedAt());
                } catch (Exception e) {
                    log.error("Error processing TextEntry ID: {}, Title: {}", 
                        textEntry.getId(), textEntry.getTitle(), e);
                }
            }
            
            // Ordenar por fecha de creación (más reciente primero)
            result.sort((a, b) -> {
                if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                }
                if (a.getCreatedAt() != null) return -1;
                if (b.getCreatedAt() != null) return 1;
                return 0;
            });
            
            // Añadir archivos huérfanos (archivos físicos sin TextEntry asociado)
            if (Files.exists(uploadPath)) {
                try {
                    Files.list(uploadPath)
                            .filter(Files::isRegularFile)
                            .forEach(path -> {
                                try {
                                    String filename = path.getFileName().toString();
                                    String audioUrl = "/uploads/audio/" + filename;
                                    
                                    // Verificar si ya está en la lista
                                    boolean exists = textEntries.stream()
                                            .anyMatch(entry -> audioUrl.equals(entry.getAudioUrl()));
                                    
                                    if (!exists) {
                                        // Archivo huérfano
                                        long fileSize = Files.size(path);
                                        result.add(AudioFileInfo.builder()
                                                .filename(filename)
                                                .audioUrl(audioUrl)
                                                .title("(Sin texto asociado)")
                                                .username("(Desconocido)")
                                                .textEntryId(null)
                                                .createdAt(null)
                                                .fileSize(fileSize)
                                                .build());
                                    }
                                } catch (IOException e) {
                                    log.warn("Error processing orphan file: {}", path.getFileName(), e);
                                }
                            });
                } catch (IOException e) {
                    log.warn("Error listing orphan files", e);
                }
            }
            
            log.info("=== FIN getAllAudioFilesWithInfo ===");
            log.info("Returning {} audio files with info", result.size());
            if (result.isEmpty()) {
                log.warn("⚠️  WARNING: No audio files returned! Check logs above for details.");
            } else {
                log.info("Files to return:");
                result.forEach(file -> {
                    log.info("  - {} ({} - {})", file.getFilename(), file.getTitle(), file.getUsername());
                });
            }
            return result;
        } catch (Exception e) {
            log.error("Error listing audio files with info", e);
            return java.util.Collections.emptyList();
        }
    }
}
