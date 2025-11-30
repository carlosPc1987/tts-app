package com.ttsapp.controller;

import com.ttsapp.service.TtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tts")
@RequiredArgsConstructor
public class TtsController {
    
    private final TtsService ttsService;
    
    @GetMapping("/speak")
    public ResponseEntity<byte[]> speak(
            @RequestParam String text,
            @RequestParam(required = false, defaultValue = "es-ES-ElviraNeural") String voice) {
        
        byte[] audioData = ttsService.generateAudio(text, voice);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
        headers.setContentLength(audioData.length);
        headers.set("Content-Disposition", "inline; filename=audio.mp3");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(audioData);
    }
}

