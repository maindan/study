package com.study.study.DTO;

public record StudyStateUpdateDTO(
        Long topic_id,
        Long task_id,
        Integer time_study,
        Integer time_break,
        Integer daily_time_goal
) {
}
