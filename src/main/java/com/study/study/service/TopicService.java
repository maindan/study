package com.study.study.service;

import com.study.study.DTO.TopicResponseDTO;
import com.study.study.model.Topic;
import com.study.study.repository.TopicRepository;
import com.study.study.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;
    private final TaskService taskService;
    private final UserRepository userRepository;

    public List<TopicResponseDTO> getAll() {
        List<Topic> topics = topicRepository.findAllByCreatedById(1L).orElseThrow(()-> new EntityNotFoundException("Topics not found"));
        return convertTopicListDTO(topics);
    }

    private TopicResponseDTO convertTopicDTO(Topic topic) {
        return new TopicResponseDTO(
                topic.getId(),
                topic.getName(),
                taskService.converteListTaskDTO(topic.getTasks()),
                topic.getCreatedBy().getId(),
                topic.getCreatedAt(),
                topic.getUpdatedAt()
        );
    }

    private List<TopicResponseDTO> convertTopicListDTO(List<Topic> topics) {
        return topics.stream()
                .map(this::convertTopicDTO)
                .collect(Collectors.toList());
    }
}
