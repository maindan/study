package com.study.study.controller;

import com.study.study.DTO.TopicCreateDTO;
import com.study.study.DTO.TopicResponseDTO;
import com.study.study.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topic")
@RequiredArgsConstructor
public class TopicController {
    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<TopicResponseDTO>> getAllTopics() {
        return ResponseEntity.ok().body(topicService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicResponseDTO> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok().body(topicService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TopicResponseDTO> createTopic(@RequestBody TopicCreateDTO data) {
        return ResponseEntity.ok().body(topicService.create(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TopicResponseDTO> updateTopic(@PathVariable Long id, TopicCreateDTO data) {
        return ResponseEntity.ok().body(topicService.update(id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.delete(id);
        return ResponseEntity.ok().build();
    }


}
