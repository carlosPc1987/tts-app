package com.ttsapp.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@Slf4j
public class FileTextExtractorService {

    public String extractText(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new RuntimeException("Nombre de archivo no válido");
        }

        String extension = getFileExtension(filename).toLowerCase();
        
        try (InputStream inputStream = file.getInputStream()) {
            switch (extension) {
                case "txt":
                    return extractFromTxt(inputStream);
                case "pdf":
                    return extractFromPdf(inputStream);
                case "docx":
                    return extractFromDocx(inputStream);
                case "doc":
                    return extractFromDoc(inputStream);
                default:
                    throw new RuntimeException("Formato de archivo no soportado: " + extension + ". Formatos soportados: TXT, PDF, DOC, DOCX");
            }
        } catch (Exception e) {
            log.error("Error extrayendo texto del archivo: {}", filename, e);
            throw new RuntimeException("Error al extraer texto del archivo: " + e.getMessage(), e);
        }
    }

    private String extractFromTxt(InputStream inputStream) throws Exception {
        return new String(inputStream.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
    }

    private String extractFromPdf(InputStream inputStream) throws Exception {
        byte[] bytes = inputStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractFromDocx(InputStream inputStream) throws Exception {
        try (XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    private String extractFromDoc(InputStream inputStream) throws Exception {
        try (HWPFDocument document = new HWPFDocument(inputStream);
             WordExtractor extractor = new WordExtractor(document)) {
            return extractor.getText();
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }

    public boolean isSupportedFormat(String filename) {
        if (filename == null) {
            return false;
        }
        String extension = getFileExtension(filename).toLowerCase();
        return extension.equals("txt") || 
               extension.equals("pdf") || 
               extension.equals("doc") || 
               extension.equals("docx");
    }
}

