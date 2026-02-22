package com.company.hrms.common.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {

        this.mailSender=mailSender;
    }

    @Async
    public void sendTravelAssignmentEmail(
            String toEmail,
            String employeeName,
            String travelTitle,
            String startDate,
            String endDate
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("New Travel Assigned");
        message.setText(
                        "Hello " + employeeName + ",\n\n" +
                        "You have been assigned a new travel.\n\n" +
                        "Title: " + travelTitle + "\n" +
                        "Start Date: " + startDate + "\n" +
                        "End Date: " + endDate + "\n\n" +
                        "Please check HRMS for more details.\n\n" +
                        "HR Team"
        );
        mailSender.send(message);
    }


    @Async
    public void sendExpenseSubmissionEmail(
            String hrEmail,
            String employeeName,
            String travelTitle,
            Integer expenseId,
            String amount
    )
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(hrEmail);
        message.setSubject("New Expense Submitted for Approval");
        message.setText(
                        "Hello HR,\n\n" +
                        "A new expense has been submitted.\n\n" +
                        "Expense ID: " + expenseId + "\n" +
                        "Employee: " + employeeName + "\n" +
                        "Travel: " + travelTitle + "\n" +
                        "Amount: " + amount + "\n\n" +
                                "Please check HRMS to review and approve/reject the expense.\n\n" +
                                "HRMS System"
        );

        mailSender.send(message);
    }




    @Async
    public void sendGameBookingEmail(
            List<String> recipientEmails,
            String gameName,
            String slotDate,
            String startTime,
            String endTime,
            String bookingStatus,
            List<String> participantNames
    ) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmails.toArray(new String[0]));
        message.setSubject("Game Slot Booking Update - " + gameName);

        message.setText(
                "Hello,\n\n" +
                        "Your game slot booking has been updated.\n\n" +
                        "Game: " + gameName + "\n" +
                        "Date: " + slotDate + "\n" +
                        "Time: " + startTime + " - " + endTime + "\n" +
                        "Status: " + bookingStatus + "\n\n" +
                        "Participants:\n" +
                        String.join("\n", participantNames) +
                        "\n\nPlease login to HRMS for more details.\n\n" +
                        "HRMS Games Module"
        );

        mailSender.send(message);
    }

}
