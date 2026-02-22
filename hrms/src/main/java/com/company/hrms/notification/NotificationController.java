package com.company.hrms.notification;

import com.company.hrms.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service){
        this.service = service;
    }

    @GetMapping
    public List<NotificationDto> listNotifications(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ){
        return service.listNotifications(user.getEmployeeId(), page, size);
    }

    @GetMapping("/unread-count")
    public Long unreadCount(@AuthenticationPrincipal CustomUserDetails user){
        return service.countUnread(user.getEmployeeId());
    }

    @PostMapping("/{id}/read")
    public void markRead(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id){
        service.markAsRead(id, user.getEmployeeId());
    }

}

