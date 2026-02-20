//package com.company.hrms.games.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Table(name="GamesSlotConfig")
//@Getter
//@Setter
//public class GameSlotConfig {
//
//    @Id
//    @GeneratedValue(strategy= GenerationType.IDENTITY)
//    private Integer configId;
//
//    @ManyToOne
//    @JoinColumn(name="GameId")
//    private Game game;
//
//    private Integer slotDurationMinutes;
//
//    private Integer maxPlayers;
//
//    private String startHour;
//
//    private String endHour;
//}
