package com.study.study.service;

import com.study.study.DTO.TaskCreateDTO;
import com.study.study.DTO.TopicCreateDTO;
import com.study.study.DTO.TopicResponseDTO;
import com.study.study.model.Task;
import com.study.study.model.Topic;
import com.study.study.model.User;
import com.study.study.repository.TopicRepository;
import com.study.study.repository.UserRepository;
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
public class TopicService {
    private final TopicRepository topicRepository;
    private final TaskService taskService;
    private final SecurityUtils securityUtils;
    private final UserService userService;
    private final UserRepository userRepository;

    public List<TopicResponseDTO> getAll() {
        List<Topic> topics = topicRepository.findAllByCreatedById(securityUtils.getUserId());
        return convertTopicListDTO(topics);
    }

    public TopicResponseDTO getById(Long id) {
        Long userId = securityUtils.getUserId();
        Topic topic = topicRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        if(topic.getCreatedBy().getId() != userId) {
            throw new EntityNotFoundException();
        }
        return convertTopicDTO(topic);
    }

    public TopicResponseDTO create(TopicCreateDTO data) {
        Topic topic = new Topic();
        User user = userRepository.findById(securityUtils.getUserId()).orElseThrow(EntityNotFoundException::new);
        topic.setName(data.name());

        List<Task> tasks = new ArrayList<>();
        if(data.tasks() != null && !data.tasks().isEmpty()) {
            for(TaskCreateDTO taskData : data.tasks()) {
                Task task = taskService.convertToEntity(taskData);
                task.setCreatedBy(user);
                task.setTopic(topic);
                tasks.add(task);
            }
        }

        topic.setTasks(tasks);
        topic.setCreatedBy(user);
        topicRepository.save(topic);
        return convertTopicDTO(topic);
    }

    public TopicResponseDTO update(Long id, TopicCreateDTO data) {
        Topic topic = topicRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        Optional.ofNullable(data.name()).ifPresent(topic::setName);
        topicRepository.save(topic);
        return convertTopicDTO(topic);
    }

    public void delete(Long id) {
        Topic topic = topicRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        topicRepository.delete(topic);
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
