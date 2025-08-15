package com.study.study.DTO;

public record ProfileInitialCreateResponseDTO(
        ProfileResponseDTO profile,
        StudyStateMininalDTO study_state
) {
}
