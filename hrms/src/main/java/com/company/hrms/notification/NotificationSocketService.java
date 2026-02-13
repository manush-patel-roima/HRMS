package com.company.hrms.notification;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationSocketService(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate=messagingTemplate;
    }

    public void sendNotification(Integer employeeId, String message){
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + employeeId,
                message
        );
    }

}
