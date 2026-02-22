package com.company.hrms.games.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "BookingQueue")
@Getter
@Setter
public class BookingQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer queueId;

    @ManyToOne
    @JoinColumn(name = "BookingGroupId", nullable = false)
    private BookingGroup bookingGroup;

    private LocalDateTime addedAt;
}
