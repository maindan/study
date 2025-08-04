package com.study.study.DTO;

import com.study.study.model.TaskStatus;

public record TaskCreateDTO(
        String description,
        TaskStatus status,
        Long topic_id

) {
}
