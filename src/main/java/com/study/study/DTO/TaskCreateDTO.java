package com.study.study.DTO;

import com.study.study.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;

public record TaskCreateDTO(
        @NotBlank String description,
        TaskStatus status,
        Long topic_id
) {
}
