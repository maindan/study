package com.study.study.service;

import com.study.study.DTO.ProfileCreateDTO;
import com.study.study.DTO.ProfileResponseDTO;
import com.study.study.model.Profile;
import com.study.study.model.User;
import com.study.study.repository.ProfileRepository;
import com.study.study.repository.UserRepository;
import com.study.study.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    public ProfileResponseDTO create(ProfileCreateDTO data) {
        User user = userRepository.findById(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Profile profile = new Profile();
        profile.setName(data.name());
        Optional.ofNullable(data.profile_img()).ifPresent(profile::setProfileImg);
        profile.setDailyTimeGoal(data.daily_time_goal());
        profile.setUser(user);

        profileRepository.save(profile);
        return convertProfileDTO(profile);
    }

    public ProfileResponseDTO findByUserId() {
        Profile profile = profileRepository.findByUserId(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return convertProfileDTO(profile);
    }

    public ProfileResponseDTO update(ProfileCreateDTO data) {
        Profile profile = profileRepository.findByUserId(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Optional.ofNullable(data.name()).ifPresent(profile::setName);
        Optional.ofNullable(data.profile_img()).ifPresent(profile::setProfileImg);
        Optional.ofNullable(data.daily_time_goal()).ifPresent(profile::setDailyTimeGoal);

        profileRepository.save(profile);
        return convertProfileDTO(profile);
    }

    public ProfileResponseDTO convertProfileDTO(Profile profile) {
        return new ProfileResponseDTO(
                profile.getId(),
                profile.getName(),
                profile.getProfileImg(),
                profile.getDailyTimeGoal(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
