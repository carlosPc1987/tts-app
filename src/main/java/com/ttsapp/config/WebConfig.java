package com.ttsapp.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File uploadDir = new File("uploads/audio");
        String uploadPath;
        
        try {
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            uploadPath = uploadDir.getAbsolutePath();
            
            if (!uploadPath.endsWith(File.separator)) {
                uploadPath += File.separator;
            }
            
            String resourceLocation = "file:" + uploadPath.replace("\\", "/");
            if (!resourceLocation.endsWith("/")) {
                resourceLocation += "/";
            }
            
            log.info("Configurando recursos estáticos:");
            log.info("  Handler: /uploads/**");
            log.info("  Location: {}", resourceLocation);
            log.info("  Path absoluto: {}", uploadPath);
            
            registry.addResourceHandler("/uploads/audio/**")
                    .addResourceLocations(resourceLocation)
                    .setCachePeriod(0)
                    .resourceChain(true);
            
            log.info("✅ Recursos estáticos configurados correctamente");
        } catch (Exception e) {
            log.error("Error configurando recursos estáticos", e);
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:uploads/audio/")
                    .setCachePeriod(0);
        }
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.mediaType("mp3", MediaType.parseMediaType("audio/mpeg"));
        configurer.mediaType("mpeg", MediaType.parseMediaType("audio/mpeg"));
    }
}

