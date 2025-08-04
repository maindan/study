package com.study.study.repository;

import com.study.study.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic,Long> {
    Optional<List<Topic>> findAllByCreatedById(Long id);
}
