package com.study.study.DTO;

import jakarta.validation.constraints.NotBlank;

public record AuthLoginDTO(
        @NotBlank String email,
        @NotBlank String password
) {
}
