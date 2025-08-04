package com.study.study.repository;

import com.study.study.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic,Long> {
    List<Topic> findByCreatedById(Long id);
}
