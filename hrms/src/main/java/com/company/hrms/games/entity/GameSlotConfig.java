package com.company.hrms.games.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="GameSlotConfig")
@Getter
@Setter
public class GameSlotConfig {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer configId;

    @OneToOne
    @JoinColumn(name="GameId",nullable = false,unique=true)
    private Game game;

    @Column(nullable = false)
    private Integer slotDurationMinutes;

    @Column(nullable = false)
    private Integer minPlayers;

    @Column(nullable = false)
    private Integer maxPlayers;

    @Column(nullable = false)
    private String startHour;

    @Column(nullable = false)
    private String endHour;
}