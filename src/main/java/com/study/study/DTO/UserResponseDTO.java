package com.study.study.DTO;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Long id,
        String email,
        LocalDateTime created_at,
        LocalDateTime updated_at
        ) {
}
