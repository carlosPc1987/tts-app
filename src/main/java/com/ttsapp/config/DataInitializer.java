package com.ttsapp.config;

import com.ttsapp.entity.User;
import com.ttsapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        System.out.println("=== INICIO DataInitializer ===");
        long totalUsers = userRepository.count();
        System.out.println("Total de usuarios en BD al iniciar: " + totalUsers);
        
        if (!userRepository.existsByUsername("admin")) {
            System.out.println("Admin no existe, creando...");
            User admin = User.builder()
                    .username("admin")
                    .email("admin@ttsapp.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .textEntries(new java.util.ArrayList<>()) // Inicializar la lista vacía
                    .build();
            admin = userRepository.saveAndFlush(admin);
            System.out.println("✅ Admin creado con ID: " + admin.getId());
            
            // Verificar inmediatamente
            User savedAdmin = userRepository.findById(admin.getId()).orElse(null);
            if (savedAdmin != null) {
                System.out.println("✅ Admin verificado: " + savedAdmin.getUsername());
            } else {
                System.err.println("❌ ERROR: Admin no encontrado después de crear!");
            }
            
            long newTotal = userRepository.count();
            System.out.println("Total de usuarios después de crear admin: " + newTotal);
            log.info("Usuario admin creado: username=admin, password=admin123");
        } else {
            System.out.println("✅ Admin ya existe");
            userRepository.findByUsername("admin").ifPresent(admin -> {
                System.out.println("   ID: " + admin.getId() + ", Email: " + admin.getEmail());
            });
        }
        
        // Listar todos los usuarios
        System.out.println("=== LISTANDO TODOS LOS USUARIOS ===");
        userRepository.findAll().forEach(user -> {
            System.out.println("  - ID: " + user.getId() + ", Username: " + user.getUsername() + ", Email: " + user.getEmail() + ", Rol: " + user.getRole());
        });
        System.out.println("Total final: " + userRepository.count());
        System.out.println("=== FIN DataInitializer ===");
        log.info("Inicialización de datos completada");
    }
}

