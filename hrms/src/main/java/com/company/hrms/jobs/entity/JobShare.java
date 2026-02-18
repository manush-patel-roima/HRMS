package com.company.hrms.jobs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_shares")
@Getter
@Setter
public class JobShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shareId;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private Integer sharedByEmployeeId;

    private String recipientEmail;

    private LocalDateTime sharedAt = LocalDateTime.now();
}