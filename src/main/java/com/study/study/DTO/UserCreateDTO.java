package com.study.study.DTO;

import jakarta.validation.constraints.NotBlank;

public record UserCreateDTO(
        @NotBlank String email,
        @NotBlank String password
) {
}
