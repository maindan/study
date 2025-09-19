package com.study.study.DTO;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record TopicCreateDTO(
       @NotBlank String name,
       List<TaskCreateDTO> tasks
) {
}
