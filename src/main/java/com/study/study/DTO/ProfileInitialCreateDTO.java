package com.study.study.DTO;

public record ProfileInitialCreateDTO(
        ProfileCreateDTO profile,
        Integer daily_time_goal
) {
}
