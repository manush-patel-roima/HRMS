package com.company.hrms.notification;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.ForbiddenException;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository repo;
    private final EmployeeRepository employeeRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository repo, EmployeeRepository employeeRepo, SimpMessagingTemplate messagingTemplate){
        this.repo = repo;
        this.employeeRepo = employeeRepo;
        this.messagingTemplate = messagingTemplate;
    }

    public NotificationDto createNotification(Integer recipientId, String message, String payload, String linkUrl){
        Employee recipient = employeeRepo.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setMessage(message);
        n.setPayload(payload);
        n.setLinkUrl(linkUrl);
        n.setIsRead(false);

        Notification saved = repo.save(n);

        NotificationDto dto = toDto(saved);


        try{

            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + recipientId,
                    dto
            );


            messagingTemplate.convertAndSendToUser(
                    recipient.getEmail(),
                    "/queue/notifications",
                    dto
            );
        }catch(Exception ex){

            ex.printStackTrace();
        }

        return dto;
    }

    public List<NotificationDto> listNotifications(Integer employeeId, int page, int size){
        return repo.findByRecipient_EmployeeIdOrderByCreatedAtDesc(employeeId, PageRequest.of(page,size))
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Long countUnread(Integer employeeId){
        return repo.countByRecipient_EmployeeIdAndIsReadFalse(employeeId);
    }

    public void markAsRead(Long notificationId, Integer employeeId){
        Notification n = repo.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if(!n.getRecipient().getEmployeeId().equals(employeeId)){
            throw new ForbiddenException("Unauthorized");
        }

        n.setIsRead(true);
        repo.save(n);
    }

    private NotificationDto toDto(Notification n){
        return new NotificationDto(
                n.getId(),
                n.getRecipient().getEmployeeId(),
                n.getMessage(),
                n.getPayload(),
                n.getLinkUrl(),
                n.getIsRead(),
                n.getCreatedAt()
        );
    }

}
