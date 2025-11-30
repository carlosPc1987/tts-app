package com.ttsapp.service.impl;

import com.ttsapp.dto.UserResponse;
import com.ttsapp.entity.User;
import com.ttsapp.mapper.UserMapper;
import com.ttsapp.repository.UserRepository;
import com.ttsapp.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of UserQueryService.
 * Handles all read-only user operations.
 * Follows Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserQueryServiceImpl implements UserQueryService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.info("=== UserQueryService.getAllUsers() ===");
        
        try {
            // Get total count first
            long totalCount = userRepository.count();
            log.info("Total users in DB (count): {}", totalCount);
            
            if (totalCount == 0) {
                log.warn("No users found in database");
                return new java.util.ArrayList<>();
            }
            
            // Fetch all users using the repository method without EntityGraph first
            // This is more reliable for simple queries
            log.info("Fetching users with findAllWithoutGraph()...");
            List<User> users = userRepository.findAllWithoutGraph();
            log.info("Users found: {}", users.size());
            
            // Log each user found
            if (!users.isEmpty()) {
                log.info("=== USERS FOUND ===");
                users.forEach(u -> {
                    log.info("  - ID: {}, Username: {}, Email: {}, Role: {}", 
                        u.getId(), u.getUsername(), u.getEmail(), u.getRole());
                });
            }
            
            // If empty but count > 0, try with EntityGraph
            if (users.isEmpty() && totalCount > 0) {
                log.warn("findAllWithoutGraph() returned empty but count = {}. Trying findAll() with EntityGraph...", totalCount);
                users = userRepository.findAll();
                log.info("Users found with EntityGraph: {}", users.size());
                
                if (!users.isEmpty()) {
                    log.info("=== USERS FOUND (with EntityGraph) ===");
                    users.forEach(u -> {
                        log.info("  - ID: {}, Username: {}, Email: {}, Role: {}", 
                            u.getId(), u.getUsername(), u.getEmail(), u.getRole());
                    });
                }
            }
            
            if (users.isEmpty()) {
                log.error("CRITICAL: No users found although count() = {}", totalCount);
                return new java.util.ArrayList<>();
            }
            
            // Map entities to DTOs using mapper
            log.info("Mapping {} users to DTOs...", users.size());
            List<UserResponse> responses = userMapper.toResponseList(users);
            log.info("Successfully mapped {} users to DTOs", responses.size());
            
            // Log each response
            if (!responses.isEmpty()) {
                log.info("=== USER RESPONSES ===");
                responses.forEach(r -> {
                    log.info("  - ID: {}, Username: {}, Email: {}, Role: {}", 
                        r.getId(), r.getUsername(), r.getEmail(), r.getRole());
                });
            }
            
            log.info("=== END UserQueryService.getAllUsers() ===");
            return responses;
            
        } catch (Exception e) {
            log.error("Exception in getAllUsers(): {}", e.getMessage(), e);
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado. Por favor, inicia sesión nuevamente."));
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getUserCount() {
        return userRepository.count();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsersRaw() {
        log.debug("=== UserQueryService.getAllUsersRaw() ===");
        try {
            List<User> users = userRepository.findAllWithoutGraph();
            log.debug("Raw users found: {}", users.size());
            return users;
        } catch (Exception e) {
            log.error("Error in getAllUsersRaw(): {}", e.getMessage(), e);
            return new java.util.ArrayList<>();
        }
    }
}

