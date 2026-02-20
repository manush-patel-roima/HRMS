//package com.company.hrms.games.entity;
//
//import jakarta.persistence.*;
//import jakarta.persistence.Table;
//import lombok.*;
//
//import java.util.List;
//
//@Entity
//@Table(name="Games")
//@Getter
//@Setter
//public class Game {
//
//    @Id
//    @GeneratedValue(strategy=GenerationType.IDENTITY)
//    private Integer gameId;
//
//    private String gameName;
//
//    @OneToMany(mappedBy="game")
//    private List<GameSlot> slots;
//
//    @OneToMany(mappedBy = "game")
//    private List<GameSlotConfig> configs;
//}
