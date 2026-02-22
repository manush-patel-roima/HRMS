package com.company.hrms.notification;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Employee recipient;

    private String message;

    private String payload;

    private String linkUrl;

    private Boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

}

