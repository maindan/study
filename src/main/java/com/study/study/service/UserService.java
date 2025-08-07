package com.study.study.service;

import com.study.study.DTO.AuthLoginDTO;
import com.study.study.DTO.AuthResponseDTO;
import com.study.study.DTO.UserCreateDTO;
import com.study.study.config.security.JwtTokenService;
import com.study.study.config.security.SecurityConfig;
import com.study.study.config.security.UserDetailsImplementation;
import com.study.study.model.User;
import com.study.study.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final SecurityConfig securityConfig;

    public void create(UserCreateDTO data) {
        User user = new User();
        user.setEmail(data.email());
        user.setPassword(securityConfig.passwordEncoder().encode(data.password()));
        userRepository.save(user);
    }

    public AuthResponseDTO login(AuthLoginDTO data) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(data.email(), data.password());

        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();
        return new AuthResponseDTO(jwtTokenService.generateToken(userDetails));
    }

}
