//package com.company.hrms.games.entity;
//
//import com.company.hrms.employee.entity.Employee;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Table(name="SlotBookings")
//@Getter
//@Setter
//public class SlotBooking {
//
//    @Id
//    @GeneratedValue(strategy= GenerationType.IDENTITY)
//    private Integer bookingId;
//
//    @ManyToOne
//    @JoinColumn(name="SlotId")
//    private GameSlot slot;
//
//    @ManyToOne
//    @JoinColumn(name="EmployeeId")
//    private Employee employee;
//
//    private String bookingStatus;
//}
