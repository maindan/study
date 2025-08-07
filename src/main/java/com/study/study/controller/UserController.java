package com.study.study.controller;

import com.study.study.DTO.AuthLoginDTO;
import com.study.study.DTO.AuthResponseDTO;
import com.study.study.DTO.UserCreateDTO;
import com.study.study.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/user/create")
    public ResponseEntity createUser(UserCreateDTO data) {
        userService.create(data);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth")
    public ResponseEntity<AuthResponseDTO> auth(AuthLoginDTO data) {
        return ResponseEntity.ok().body(userService.login(data));
    }
}
