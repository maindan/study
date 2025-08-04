package com.study.study.repository;

import com.study.study.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTopicId(Long topicId);

    List<Task> findByCreatedById(Long userId);
}
