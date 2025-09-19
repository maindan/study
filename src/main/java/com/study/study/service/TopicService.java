package com.study.study.service;

import com.study.study.DTO.TaskCreateDTO;
import com.study.study.DTO.TopicCreateDTO;
import com.study.study.DTO.TopicResponseDTO;
import com.study.study.model.StudyState;
import com.study.study.model.Task;
import com.study.study.model.Topic;
import com.study.study.model.User;
import com.study.study.repository.StudyStateRepository;
import com.study.study.repository.TopicRepository;
import com.study.study.repository.UserRepository;
import com.study.study.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;
    private final TaskService taskService;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final StudyStateRepository studyStateRepository;
    private static final String CACHE_NAME = "Topic";

    public List<TopicResponseDTO> getAll() {
        List<Topic> topics = topicRepository.findAllByCreatedById(securityUtils.getUserId());
        return convertTopicListDTO(topics);
    }

    public TopicResponseDTO getById(Long id) throws InterruptedException {
        Topic topic = topicRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        if(!topic.getCreatedBy().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        return convertTopicDTO(topic);
    }

    public TopicResponseDTO create(TopicCreateDTO data) {
        Topic topic = new Topic();
        User user = userRepository.findById(securityUtils.getUserId()).orElseThrow(EntityNotFoundException::new);
        topic.setName(data.name());
        System.out.println(data.toString());
        List<Task> tasks = new ArrayList<>();
        if(data.tasks() != null && !data.tasks().isEmpty()) {
            for(TaskCreateDTO taskData : data.tasks()) {
                System.out.println(taskData.toString());
                Task task = new Task();
                task.setDescription(taskData.description());
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
        if(!topic.getCreatedBy().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        Optional.ofNullable(data.name()).ifPresent(topic::setName);
        topicRepository.save(topic);
        return convertTopicDTO(topic);
    }

    public void delete(Long id) {
        Topic topic = topicRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        StudyState studyState = studyStateRepository.findByCreatedById(securityUtils.getUserId()).orElseThrow(EntityNotFoundException::new);
        if(!topic.getCreatedBy().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        if(studyState.getCurrentTopic() != null && studyState.getCurrentTopic().getId().equals(id)) {
            if(studyState.getCurrentTask() != null && studyState.getCurrentTask().getTopic().getId().equals(id)) {
                studyState.setCurrentTask(null);
            }
            studyState.setCurrentTopic(null);
            studyStateRepository.save(studyState);
        }
        topicRepository.delete(topic);
    }

    private TopicResponseDTO convertTopicDTO(Topic topic) {
        List<Task> sortedTasks = null;
        if(topic.getTasks() != null && !topic.getTasks().isEmpty()) {
            sortedTasks = topic.getTasks().stream().sorted(Comparator.comparing(Task::getCreatedAt)).toList();
        }
        return new TopicResponseDTO(
                topic.getId(),
                topic.getName(),
                sortedTasks != null? taskService.converteListTaskDTO(sortedTasks) : null,
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
