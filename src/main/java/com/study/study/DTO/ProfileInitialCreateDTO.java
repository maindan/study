package com.study.study.DTO;

import jakarta.validation.constraints.NotBlank;

public record ProfileInitialCreateDTO(
        @NotBlank ProfileCreateDTO profile,
        @NotBlank Integer daily_time_goal
) {
}
