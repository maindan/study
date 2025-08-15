package com.study.study.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudyState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    private Topic currentTopic;

    @OneToOne(fetch = FetchType.LAZY)
    private Task currentTask;

    private Integer totalTimeStudy = 0;
    private Integer totalTimeBreak = 0;
    private Integer dailyTimeGoal = 0;

    @OneToOne(fetch = FetchType.LAZY)
    private User createdBy;

}
