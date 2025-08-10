package com.study.study.DTO;

public record ProfileInitialCreateResponseDTO(
        ProfileResponseDTO profile,
        StudyStateResponseDTO study_state
) {
}
