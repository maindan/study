package com.study.study.DTO;

import java.util.List;

public record TopicCreateDTO(
       String name,
       Long user_id,
       List<TaskCreateDTO> tasks
) {
}
