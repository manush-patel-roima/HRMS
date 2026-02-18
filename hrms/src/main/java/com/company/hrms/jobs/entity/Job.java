package com.company.hrms.jobs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jobId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private String jdFileUrl;

    private String hrContactEmail;

    private Boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<JobReviewer> reviewers;

}
