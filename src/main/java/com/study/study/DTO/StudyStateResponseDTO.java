package com.study.study.DTO;

public record StudyStateResponseDTO(
        Long id,
        Long current_topic_id,
        Long current_task_id,
        Integer total_time_study,
        Integer total_time_break,
        Integer daily_time_goal
) {
}
