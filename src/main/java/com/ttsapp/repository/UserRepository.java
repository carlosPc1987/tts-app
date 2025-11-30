package com.ttsapp.repository;

import com.ttsapp.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Override
    @EntityGraph(attributePaths = {"textEntries"})
    List<User> findAll();
    
    // Método alternativo sin EntityGraph para debugging
    @Query("SELECT u FROM User u")
    List<User> findAllWithoutGraph();
}

