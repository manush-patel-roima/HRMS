package com.company.hrms.notification;

import org.springframework.stereotype.Service;

@Service
public class NotificationSocketService {

    private final NotificationService notificationService;

    public NotificationSocketService(NotificationService notificationService){
        this.notificationService = notificationService;
    }

    public void sendNotification(Integer employeeId, String message){
        notificationService.createNotification(employeeId, message, null, null);
    }

}
