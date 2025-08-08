package com.study.study.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Table(name="profile")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Profile extends BaseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @Column(nullable=false)
    private String name;
    private String profileImg;
    private Integer dailyTimeGoal;
}
