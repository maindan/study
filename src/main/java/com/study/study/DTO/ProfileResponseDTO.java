package com.study.study.DTO;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public record ProfileResponseDTO(
        Long id,
        String name,
        String profile_img,
        LocalDateTime created_at,
        LocalDateTime updated_at
        ) {
}
