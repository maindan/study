package com.study.study.service;

import com.study.study.DTO.StudyStateResponseDTO;
import com.study.study.DTO.StudyStateUpdateDTO;
import com.study.study.model.StudyState;
import com.study.study.model.Task;
import com.study.study.model.Topic;
import com.study.study.model.User;
import com.study.study.repository.StudyStateRepository;
import com.study.study.repository.TaskRepository;
import com.study.study.repository.TopicRepository;
import com.study.study.repository.UserRepository;
import com.study.study.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudyStateService {
    private final StudyStateRepository studyStateRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final TopicRepository topicRepository;
    private final TaskRepository taskRepository;

    public StudyStateResponseDTO getUserStudyState() {
        StudyState studyState = studyStateRepository.findByCreatedById(securityUtils.getUserId())
                .orElseThrow(EntityNotFoundException::new);
        return convertStudyStateDTO(studyState);
    }

    public StudyState createUserStudyState(User user, Integer daily_time_goal) {
        StudyState studyState = new StudyState();
        studyState.setDailyTimeGoal(daily_time_goal);
        studyState.setCreatedBy(user);
        studyStateRepository.save(studyState);
        return studyState;
    }

    public StudyStateResponseDTO updateStudyState(StudyStateUpdateDTO data) {
        StudyState studyState = studyStateRepository.findByCreatedById(securityUtils.getUserId())
                .orElseThrow(EntityNotFoundException::new);

        if(!studyState.getCreatedBy().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }

        Optional.ofNullable(data.topic_id())
                .ifPresent(topicId -> {
                    Topic topic = topicRepository.findById(topicId)
                            .orElseThrow(EntityNotFoundException::new);
                    studyState.setCurrentTopic(topic);
                });

        Optional.ofNullable(data.task_id())
                .ifPresent(taskId -> {
                    Task task = taskRepository.findById(taskId)
                            .orElseThrow(EntityNotFoundException::new);
                    studyState.setCurrentTask(task);
                });

        Optional.ofNullable(data.time_study())
                .ifPresent(timeStudy -> {
                    if(studyState.getTotalTimeStudy() != null) {
                        studyState.setTotalTimeStudy(studyState.getTotalTimeStudy() + timeStudy);
                    } else {
                        studyState.setTotalTimeStudy(timeStudy);
                    }
                });

        Optional.ofNullable(data.time_break())
                .ifPresent(timeBreak -> {
                    if(studyState.getTotalTimeBreak() != null) {
                        studyState.setTotalTimeStudy(studyState.getTotalTimeBreak() + timeBreak);
                    } else {
                        studyState.setTotalTimeBreak(timeBreak);
                    }
                });

        Optional.ofNullable(data.daily_time_goal()).ifPresent(studyState::setDailyTimeGoal);

        studyStateRepository.save(studyState);
        return convertStudyStateDTO(studyState);
    }


    public StudyStateResponseDTO convertStudyStateDTO(StudyState data) {
        return new StudyStateResponseDTO(
                data.getId(),
                data.getCurrentTopic().getId(),
                data.getCurrentTask().getId(),
                data.getTotalTimeStudy(),
                data.getTotalTimeBreak(),
                data.getDailyTimeGoal()
        );
    }
}
