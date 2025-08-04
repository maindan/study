package com.study.study.DTO;

import com.study.study.model.TaskStatus;

public record DailyTaskCreateDTO(
        String description,
        TaskStatus status,
        Integer time_goal,
        Long user_id

) {
}
