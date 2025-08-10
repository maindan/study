package com.study.study.repository;

import com.study.study.model.StudyState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyStateRepository extends JpaRepository<StudyState, Long> {
    Optional<StudyState> findByCreatedById(Long id);
}
