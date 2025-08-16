package com.study.study.DTO;

import java.util.List;

public record TopicCreateDTO(
       String name,
       List<TaskCreateDTO> tasks
) {
}
