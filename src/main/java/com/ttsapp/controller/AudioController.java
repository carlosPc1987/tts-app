package com.ttsapp.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@Slf4j
public class AudioController {

    private static final String UPLOAD_DIR = "uploads/audio";

    @GetMapping("/audio/{filename:.+}")
    public ResponseEntity<Resource> getAudioFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                log.warn("Audio file not found: {}", filename);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(file);
            String contentType = Files.probeContentType(filePath);
            
            if (contentType == null || !contentType.startsWith("audio/")) {
                contentType = "audio/mpeg";
            }

            log.debug("Serving audio file: {} with content-type: {}", filename, contentType);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);

        } catch (Exception e) {
            log.error("Error serving audio file: {}", filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

