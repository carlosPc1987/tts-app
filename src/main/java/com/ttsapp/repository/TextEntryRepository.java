package com.ttsapp.repository;

import com.ttsapp.entity.TextEntry;
import com.ttsapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TextEntryRepository extends JpaRepository<TextEntry, Long> {
    List<TextEntry> findByUser(User user);
    Optional<TextEntry> findByIdAndUser(Long id, User user);
}

