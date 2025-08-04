package com.study.study.controller;

import com.study.study.DTO.TaskCreateDTO;
import com.study.study.DTO.TaskResponseDTO;
import com.study.study.model.Task;
import com.study.study.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTask(@PathVariable Long id) {
        return  ResponseEntity.ok(taskService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskCreateDTO data) {
        return ResponseEntity.ok(taskService.create(data));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> UpdateTask(@PathVariable Long id, TaskCreateDTO data) {
        return ResponseEntity.ok(taskService.update(id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}
