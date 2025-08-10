package com.study.study.controller;

import com.study.study.DTO.StudyStateResponseDTO;
import com.study.study.DTO.StudyStateUpdateDTO;
import com.study.study.service.StudyStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/study_state")
@RequiredArgsConstructor
public class StudyStateController {
    private final StudyStateService studyStateService;

    @GetMapping
    public ResponseEntity<StudyStateResponseDTO> getStudyState() {
        return ResponseEntity.ok().body(studyStateService.getUserStudyState());
    }

    @PutMapping
    public ResponseEntity<StudyStateResponseDTO> updateStudyState(StudyStateUpdateDTO data) {
        return ResponseEntity.ok().body(studyStateService.updateStudyState(data));
    }
}
