package com.ttsapp.controller;

import com.ttsapp.dto.TextEntryResponse;
import com.ttsapp.dto.UserResponse;
import com.ttsapp.exception.UserNotFoundException;
import com.ttsapp.service.TextEntryService;
import com.ttsapp.service.TtsService;
import com.ttsapp.service.UserCommandService;
import com.ttsapp.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    
    private final TextEntryService textEntryService;
    private final UserQueryService userQueryService;
    private final UserCommandService userCommandService;
    private final TtsService ttsService;
    
    @GetMapping("/texts")
    public ResponseEntity<List<TextEntryResponse>> getAllTexts() {
        try {
            List<TextEntryResponse> texts = textEntryService.getAllTextEntries();
            return ResponseEntity.ok(texts != null ? texts : Collections.emptyList());
        } catch (Exception e) {
            log.error("Error fetching all texts for admin", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }
    
    @DeleteMapping("/texts/{id}")
    public ResponseEntity<Void> deleteText(@PathVariable Long id) {
        try {
            textEntryService.deleteTextEntryAsAdmin(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting text {} as admin", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        try {
            log.debug("=== AdminController.getAllUsers() ===");
            
            // Get count first for logging
            long countBefore = userQueryService.getUserCount();
            log.debug("Total users in DB (count): {}", countBefore);
            
            // Get all users using query service
            List<UserResponse> users = userQueryService.getAllUsers();
            log.debug("Users retrieved: {}", users != null ? users.size() : 0);
            
            if (users != null && !users.isEmpty()) {
                log.info("Successfully retrieved {} users for admin", users.size());
            } else {
                log.warn("No users found. Count in DB: {}", countBefore);
            }
            
            return ResponseEntity.ok(users != null ? users : Collections.emptyList());
            
        } catch (Exception e) {
            log.error("Error fetching all users for admin", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userCommandService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (UserNotFoundException e) {
            log.warn("User not found for deletion: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting user {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/files")
    public ResponseEntity<?> getAllAudioFiles(@RequestParam(required = false, defaultValue = "false") boolean detailed) {
        try {
            if (detailed) {
                // Retornar información detallada
                var files = ttsService.getAllAudioFilesWithInfo();
                return ResponseEntity.ok(files != null ? files : Collections.emptyList());
            } else {
                // Retornar solo URLs (compatibilidad hacia atrás)
                List<String> files = ttsService.getAllAudioFiles();
                return ResponseEntity.ok(files != null ? files : Collections.emptyList());
            }
        } catch (Exception e) {
            log.error("Error fetching all audio files for admin", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }
    
    @GetMapping("/users/debug")
    public ResponseEntity<Map<String, Object>> debugUsers() {
        Map<String, Object> debug = new HashMap<>();
        try {
            log.debug("=== DEBUG ENDPOINT ===");
            
            // Count
            long count = userQueryService.getUserCount();
            debug.put("count", count);
            log.debug("Count: {}", count);
            
            // Get all users as DTOs
            List<UserResponse> allUsers = userQueryService.getAllUsers();
            debug.put("getAllUsers_size", allUsers != null ? allUsers.size() : 0);
            debug.put("getAllUsers_list", allUsers);
            log.debug("getAllUsers size: {}", allUsers != null ? allUsers.size() : 0);
            
            // Find admin specifically
            var admin = userQueryService.getUserByUsername("admin");
            debug.put("admin_found", admin != null);
            if (admin != null) {
                debug.put("admin_id", admin.getId());
                debug.put("admin_username", admin.getUsername());
            }
            
            // Get raw users
            var allUsersEntity = userQueryService.getAllUsersRaw();
            debug.put("raw_users_count", allUsersEntity != null ? allUsersEntity.size() : 0);
            if (allUsersEntity != null && !allUsersEntity.isEmpty()) {
                List<Map<String, Object>> rawUsersList = new java.util.ArrayList<>();
                for (var user : allUsersEntity) {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    userMap.put("email", user.getEmail());
                    userMap.put("role", user.getRole() != null ? user.getRole().name() : "null");
                    rawUsersList.add(userMap);
                }
                debug.put("raw_users", rawUsersList);
            }
            
            log.debug("=== FIN DEBUG ===");
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            log.error("Error in debug endpoint", e);
            debug.put("error", e.getMessage());
            debug.put("errorType", e.getClass().getName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(debug);
        }
    }

    @DeleteMapping("/files")
    public ResponseEntity<Void> deleteAudioFile(@RequestParam String audioUrl) {
        try {
            ttsService.deleteAudioFile(audioUrl);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting audio file: {}", audioUrl, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

