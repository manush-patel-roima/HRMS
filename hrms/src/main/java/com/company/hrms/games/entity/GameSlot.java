//package com.company.hrms.games.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//
//@Entity
//@Table(name="GameSlots")
//@Getter
//@Setter
//public class GameSlot {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer slotId;
//
//    @ManyToOne
//    @JoinColumn(name="GameId")
//    private Game game;
//
//    private LocalDate slotDate;
//
//    private LocalTime startTime;
//
//    private LocalTime endTime;
//
//    @OneToMany(mappedBy="slot")
//    private List<SlotBooking> bookings;
//}
