package com.company.hrms.jobs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "referral_email_logs")
@Getter
@Setter
public class ReferralEmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "referral_id")
    private Referral referral;

    private String recipientEmail;

    private String emailType;

    private LocalDateTime sentAt = LocalDateTime.now();
}