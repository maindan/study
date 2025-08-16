package com.study.study.controller;

import com.study.study.DTO.StudyStateResponseDTO;
import com.study.study.DTO.StudyStateUpdateDTO;
import com.study.study.service.StudyStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<StudyStateResponseDTO> updateStudyState(@RequestBody StudyStateUpdateDTO data) {
        return ResponseEntity.ok().body(studyStateService.updateStudyState(data));
    }
}
