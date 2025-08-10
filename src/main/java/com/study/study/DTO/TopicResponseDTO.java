package com.study.study.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TopicResponseDTO(
        Long id,
        String name,
        List<TaskResponseDTO> tasks,
        LocalDateTime created_at,
        LocalDateTime updated_at
) {
}
