package com.company.hrms.games.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "BookingGroups")
@Getter
@Setter
public class BookingGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingGroupId;

    @ManyToOne
    @JoinColumn(name = "SlotId", nullable = false)
    private GameSlot slot;

    @ManyToOne
    @JoinColumn(name = "RequestedBy", nullable = false)
    private Employee requestedBy;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    private LocalDateTime requestedAt;

    @OneToMany(mappedBy = "bookingGroup", cascade = CascadeType.ALL)
    private List<SlotParticipant> participants;
}
