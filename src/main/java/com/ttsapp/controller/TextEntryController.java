package com.ttsapp.controller;

import com.ttsapp.dto.TextEntryRequest;
import com.ttsapp.dto.TextEntryResponse;
import com.ttsapp.service.FileTextExtractorService;
import com.ttsapp.service.TextEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/texts")
@RequiredArgsConstructor
public class TextEntryController {
    
    private final TextEntryService textEntryService;
    private final FileTextExtractorService fileTextExtractorService;
    
    @GetMapping
    public ResponseEntity<List<TextEntryResponse>> getMyTexts() {
        return ResponseEntity.ok(textEntryService.getUserTextEntries());
    }
    
    @PostMapping
    public ResponseEntity<TextEntryResponse> createText(@Valid @RequestBody TextEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(textEntryService.createTextEntry(request));
    }

    @PostMapping("/upload")
    public ResponseEntity<TextEntryResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "voice", defaultValue = "es-ES-ElviraNeural") String voice) {
        
        System.out.println("=== INICIO uploadFile ===");
        System.out.println("Archivo: " + file.getOriginalFilename());
        System.out.println("Tamaño: " + file.getSize() + " bytes");
        System.out.println("Título: " + title);
        System.out.println("Voz: " + voice);
        
        if (file.isEmpty()) {
            System.err.println("ERROR: El archivo está vacío");
            throw new RuntimeException("El archivo está vacío");
        }

        if (!fileTextExtractorService.isSupportedFormat(file.getOriginalFilename())) {
            System.err.println("ERROR: Formato no soportado: " + file.getOriginalFilename());
            throw new RuntimeException("Formato de archivo no soportado. Formatos permitidos: TXT, PDF, DOC, DOCX");
        }

        System.out.println("Extrayendo texto del archivo...");
        String extractedText = fileTextExtractorService.extractText(file);
        System.out.println("Texto extraído, longitud: " + (extractedText != null ? extractedText.length() : "null"));
        
        if (extractedText == null || extractedText.trim().isEmpty()) {
            System.err.println("ERROR: No se pudo extraer texto o está vacío");
            throw new RuntimeException("No se pudo extraer texto del archivo o el archivo está vacío");
        }

        String finalTitle = title != null && !title.trim().isEmpty() 
            ? title 
            : file.getOriginalFilename();
        System.out.println("Título final: " + finalTitle);

        TextEntryRequest request = new TextEntryRequest();
        request.setTitle(finalTitle);
        request.setContent(extractedText);
        request.setVoice(voice);

        System.out.println("Creando entrada de texto...");
        TextEntryResponse response = textEntryService.createTextEntry(request);
        System.out.println("Entrada creada - ID: " + response.getId() + ", audioUrl: " + response.getAudioUrl());
        System.out.println("=== FIN uploadFile ===");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TextEntryResponse> getText(@PathVariable Long id) {
        return ResponseEntity.ok(textEntryService.getTextEntry(id));
    }
    
    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<TextEntryResponse> updateText(
            @PathVariable Long id,
            @Valid @RequestBody TextEntryRequest request) {
        System.out.println("=== INICIO updateText (Controller) ===");
        System.out.println("ID recibido: " + id);
        System.out.println("Request recibido: " + (request != null ? "NOT NULL" : "NULL"));
        if (request != null) {
            System.out.println("Request title: " + request.getTitle());
            System.out.println("Request content length: " + (request.getContent() != null ? request.getContent().length() : "NULL"));
            System.out.println("Request voice: " + request.getVoice());
        } else {
            System.err.println("ERROR: Request es NULL!");
        }
        try {
            TextEntryResponse response = textEntryService.updateTextEntry(id, request);
            System.out.println("Respuesta creada - ID: " + response.getId() + ", Título: " + response.getTitle());
            System.out.println("=== FIN updateText (Controller) - EXITOSO ===");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR en updateText (Controller): " + e.getMessage());
            System.err.println("Tipo de excepción: " + e.getClass().getName());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteText(@PathVariable Long id) {
        textEntryService.deleteTextEntry(id);
        return ResponseEntity.noContent().build();
    }
}

