package com.ttsapp.repository;

import com.ttsapp.entity.TextEntry;
import com.ttsapp.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TextEntryRepository extends JpaRepository<TextEntry, Long> {
    List<TextEntry> findByUser(User user);
    Optional<TextEntry> findByIdAndUser(Long id, User user);
    
    // Método para obtener todos los TextEntry con la relación User cargada
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT t FROM TextEntry t")
    List<TextEntry> findAllWithUser();
}

