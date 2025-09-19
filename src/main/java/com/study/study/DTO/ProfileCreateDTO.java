package com.study.study.DTO;

import jakarta.validation.constraints.NotBlank;

public record ProfileCreateDTO(
        @NotBlank String name,
        String profile_img
) {
}
