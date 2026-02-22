package com.company.hrms.notification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Integer recipientId;
    private String message;
    private String payload;
    private String linkUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;
}

