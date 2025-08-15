package com.study.study.service;

import com.study.study.DTO.ProfileCreateDTO;
import com.study.study.DTO.ProfileInitialCreateDTO;
import com.study.study.DTO.ProfileInitialCreateResponseDTO;
import com.study.study.DTO.ProfileResponseDTO;
import com.study.study.model.Profile;
import com.study.study.model.StudyState;
import com.study.study.model.User;
import com.study.study.repository.ProfileRepository;
import com.study.study.repository.UserRepository;
import com.study.study.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final StudyStateService studyStateService;

    public ProfileInitialCreateResponseDTO create(ProfileInitialCreateDTO data) {
        User user = userRepository.findById(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Profile profile = new Profile();
        profile.setName(data.profile().name());
        Optional.ofNullable(data.profile().profile_img()).ifPresent(profile::setProfileImg);
        profile.setUser(user);

        profileRepository.save(profile);
        StudyState studyState = studyStateService.createUserStudyState(user, data.daily_time_goal());
        return convertProfileInitialCreateDTO(profile, studyState);
    }

    public ProfileResponseDTO findByUserId() {
        Profile profile = profileRepository.findByUserId(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("Profile not found"));
        if(!profile.getUser().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        return convertProfileDTO(profile);
    }

    public ProfileResponseDTO update(ProfileCreateDTO data) {
        Profile profile = profileRepository.findByUserId(securityUtils.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        if(!profile.getUser().getId().equals(securityUtils.getUserId())) {
            throw new AuthorizationDeniedException("You are not authorized to perform this action");
        }
        Optional.ofNullable(data.name()).ifPresent(profile::setName);
        Optional.ofNullable(data.profile_img()).ifPresent(profile::setProfileImg);

        profileRepository.save(profile);
        return convertProfileDTO(profile);
    }

    public ProfileResponseDTO convertProfileDTO(Profile profile) {
        return new ProfileResponseDTO(
                profile.getId(),
                profile.getName(),
                profile.getProfileImg() != null? profile.getProfileImg(): null,
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    public ProfileInitialCreateResponseDTO convertProfileInitialCreateDTO(
            Profile profile, StudyState studyState) {
        return new ProfileInitialCreateResponseDTO(
                convertProfileDTO(profile),
                studyStateService.convertStudyStateMinimalDTO(studyState)
        );
    }
}
