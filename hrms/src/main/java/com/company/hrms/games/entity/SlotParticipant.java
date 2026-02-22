package com.company.hrms.games.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SlotParticipants")
@Getter
@Setter
public class SlotParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer participantId;

    @ManyToOne
    @JoinColumn(name = "BookingGroupId", nullable = false)
    private BookingGroup bookingGroup;

    @ManyToOne
    @JoinColumn(name = "EmployeeId", nullable = false)
    private Employee employee;
}
