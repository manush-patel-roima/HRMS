//package com.company.hrms.common.service;
//
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//
//    private final JavaMailSender mailSender;
//
//    public EmailService(JavaMailSender mailSender) {
//
//        this.mailSender=mailSender;
//    }
//
//    @Async
//    public void sendTravelAssignmentEmail(
//            String toEmail,
//            String employeeName,
//            String travelTitle,
//            String startDate,
//            String endDate
//    ) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("New Travel Assigned");
//        message.setText(
//                        "Hello " + employeeName + ",\n\n" +
//                        "You have been assigned a new travel.\n\n" +
//                        "Title: " + travelTitle + "\n" +
//                        "Start Date: " + startDate + "\n" +
//                        "End Date: " + endDate + "\n\n" +
//                        "Please check HRMS for more details.\n\n" +
//                        "HR Team"
//        );
//        mailSender.send(message);
//    }
//
//}
