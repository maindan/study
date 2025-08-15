package com.study.study.service;

import com.study.study.DTO.TaskCreateDTO;
import com.study.study.DTO.TaskResponseDTO;
import com.study.study.model.Task;
import com.study.study.model.Topic;
import com.study.study.model.User;
import com.study.study.repository.TaskRepository;
import com.study.study.repository.TopicRepository;
import com.study.study.repository.UserRepository;
import com.study.study.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
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
    private final UserRepository userRepository;

    public TaskResponseDTO findById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        if(!task.getCreatedBy().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        return converteTaskDTO(task);
    }

    public List<TaskResponseDTO> findAll() {
        List<Task> tasks = taskRepository.findAllByCreatedById(securityUtils.getUserId());
        return converteListTaskDTO(tasks);
    }

    public TaskResponseDTO create(TaskCreateDTO data) {
        Task task = new Task();
        User user = userRepository.findById(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        task.setDescription(data.description());
        if(data.topic_id() != null) {
            task.setTopic(topicRepository.findById(data.topic_id())
                    .orElseThrow(()-> new EntityNotFoundException("Topic not found")));
        }
        task.setCreatedBy(user);
        taskRepository.save(task);
        return converteTaskDTO(task);
    }

    public TaskResponseDTO update(Long id, TaskCreateDTO data) {
        Task task = taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        if(!task.getCreatedBy().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        Optional.ofNullable(task.getDescription()).ifPresent(task::setDescription);
        Optional.ofNullable(task.getStatus()).ifPresent(task::setStatus);
        taskRepository.save(task);
        return converteTaskDTO(task);
    }

    public void delete(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        if(!task.getCreatedBy().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        taskRepository.deleteById(id);
    }

    public TaskResponseDTO converteTaskDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getDescription(),
                task.getStatus(),
                task.getTopic() != null? task.getTopic().getId():null,
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
