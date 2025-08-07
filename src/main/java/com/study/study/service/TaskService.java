package com.study.study.service;

import com.study.study.DTO.TaskCreateDTO;
import com.study.study.DTO.TaskResponseDTO;
import com.study.study.model.Task;
import com.study.study.model.Topic;
import com.study.study.repository.TaskRepository;
import com.study.study.repository.TopicRepository;
import com.study.study.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TopicRepository topicRepository;
    private final SecurityUtils securityUtils;

    public TaskResponseDTO findById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        return converteTaskDTO(task);
    }

    public List<TaskResponseDTO> findAll() {
        Long userId = securityUtils.getUserId();
        List<Task> tasks = taskRepository.findAllByCreatedById(userId);
        return converteListTaskDTO(tasks);
    }

    public TaskResponseDTO create(TaskCreateDTO data) {
        Task task = new Task();
        task.setDescription(data.description());
        task.setTopic(topicRepository.findById(data.topic_id())
                .orElseThrow(()-> new EntityNotFoundException("Topic not found")));
        taskRepository.save(task);
        return converteTaskDTO(task);
    }

    public TaskResponseDTO update(Long id, TaskCreateDTO data) {
        Task task = taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        Optional.ofNullable(task.getDescription()).ifPresent(task::setDescription);
        Optional.ofNullable(task.getStatus()).ifPresent(task::setStatus);
        Optional.ofNullable(task.getTopic()).ifPresent(topicId -> {
            task.setTopic(topicRepository.findById(id)
                    .orElseThrow(()-> new EntityNotFoundException("Topic not found")));
        });
        taskRepository.save(task);
        return converteTaskDTO(task);
    }

    public void delete(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        taskRepository.deleteById(id);
    }

    public TaskResponseDTO converteTaskDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getDescription(),
                task.getStatus(),
                task.getTopic().getId(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    public List<TaskResponseDTO> converteListTaskDTO(List<Task> tasks) {
        return tasks.stream()
                .map(this::converteTaskDTO)
                .collect(Collectors.toList());
    }

    public Task convertToEntity(TaskCreateDTO task) {
        Task taskEntity = new Task();
        taskEntity.setDescription(task.description());
        return taskEntity;
    }
}
