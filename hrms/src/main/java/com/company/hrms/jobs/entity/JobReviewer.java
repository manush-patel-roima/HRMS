package com.company.hrms.jobs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_reviewers")
@Getter
@Setter
public class JobReviewer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(nullable = false)
    private String reviewerEmail;

    private LocalDateTime createdAt = LocalDateTime.now();
}