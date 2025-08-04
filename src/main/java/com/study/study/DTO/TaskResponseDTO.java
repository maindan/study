package com.study.study.DTO;

import com.study.study.model.TaskStatus;

import java.time.LocalDateTime;

public record TaskResponseDTO(
        Long id,
        String description,
        TaskStatus status,
        Long topic_id,
        LocalDateTime created_at,
        LocalDateTime updated_at
) {
}
