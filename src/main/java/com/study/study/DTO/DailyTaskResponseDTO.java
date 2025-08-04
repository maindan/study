package com.study.study.DTO;

import com.study.study.model.TaskStatus;

import java.time.LocalDateTime;

public record DailyTaskResponseDTO(
        Long id,
        String description,
        TaskStatus status,
        Integer time_goal,
        Long created_by,
        LocalDateTime created_at,
        LocalDateTime updated_at
) {
}
