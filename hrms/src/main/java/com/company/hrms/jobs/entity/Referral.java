package com.company.hrms.jobs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.company.hrms.jobs.entity.ReferralStatus;

@Entity
@Table(name = "referrals")
@Getter
@Setter
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer referralId;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private Integer referrerEmployeeId;

    @Column(nullable = false)
    private String friendName;

    private String friendEmail;

    @Column(nullable = false)
    private String cvFileUrl;

    private String note;

    @Enumerated(EnumType.STRING)
    private ReferralStatus status = ReferralStatus.NEW;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Integer reviewedBy;

    private LocalDateTime reviewedAt;
}