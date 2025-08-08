package com.study.study.controller;

import com.study.study.DTO.ProfileCreateDTO;
import com.study.study.DTO.ProfileResponseDTO;
import com.study.study.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponseDTO> getProfile() {
        return ResponseEntity.ok().body(profileService.findByUserId());
    }

    @PostMapping
    public ResponseEntity<ProfileResponseDTO> createProfile(@RequestBody ProfileCreateDTO data) {
        return ResponseEntity.ok().body(profileService.create(data));
    }

    @PutMapping
    public ResponseEntity<ProfileResponseDTO> updateProfile(@RequestBody ProfileCreateDTO data) {
        return ResponseEntity.ok().body(profileService.update(data));
    }
}
