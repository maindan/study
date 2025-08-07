package com.study.study.repository;

import com.study.study.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTopicId(Long topicId);

    List<Task> findAllByCreatedById(Long userId);
}
