package com.study.study.DTO;

public record ProfileCreateDTO(
        Long user_id,
        String name,
        String profile_img,
        Integer daily_time_goal
) {
}
