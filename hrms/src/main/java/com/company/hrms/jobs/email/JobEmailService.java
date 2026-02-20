package com.company.hrms.jobs.email;

import org.springframework.core.io.UrlResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.*;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import java.io.IOException;
import java.util.List;
import com.company.hrms.jobs.entity.*;
import com.company.hrms.jobs.repository.ReferralEmailLogRepository;

@Service
public class JobEmailService {

    private final JavaMailSender mailSender;
    private final ReferralEmailLogRepository emailLogRepo;

    public JobEmailService(JavaMailSender mailSender, ReferralEmailLogRepository emailLogRepo) {
        this.mailSender = mailSender;
        this.emailLogRepo = emailLogRepo;
    }

    @Async
    public void sendJobShareEmail(List<String> recipients, Job job) {

        for (String email : recipients) {
            sendEmail(email,
                    "Job Opening: " + job.getTitle(),
                    "Job Title: " + job.getTitle() +
                            "\nDescription: " + job.getDescription(),
                    job.getJdFileUrl());
        }
    }

    @Async
    public void sendReferralNotification(Referral referral,
                                         List<String> recipients) {

        for (String email : recipients) {

            sendEmail(email,
                    "New Referral - " + referral.getJob().getTitle(),
                    "Job ID: " + referral.getJob().getJobId() +
                            "\nReferrer ID: " + referral.getReferrerEmployeeId() +
                            "\nFriend: " + referral.getFriendName(),
                    referral.getCvFileUrl());

            ReferralEmailLog log = new ReferralEmailLog();
            log.setReferral(referral);
            log.setRecipientEmail(email);
            log.setEmailType("REFERRAL_NOTIFICATION");
            emailLogRepo.save(log);
        }
    }


    private void sendEmail(String to,
                           String subject,
                           String body,
                           String attachmentUrl) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            if (attachmentUrl != null && !attachmentUrl.isEmpty()) {
                UrlResource resource = new UrlResource(attachmentUrl);
                if (!resource.exists() || !resource.isReadable()) {
                    throw new IOException("Attachment not found or not readable: " + attachmentUrl);
                }
                String fileName = resource.getFilename();
                if (fileName == null) fileName = "Attachment.pdf";
                helper.addAttachment(fileName, resource);
            }

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Email failed");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
