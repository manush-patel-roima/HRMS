package com.company.hrms.games.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="Games")
@Getter
@Setter
public class Game{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameId;

    @Column( nullable = false,unique=true)
    private String gameName;

    @OneToMany(mappedBy="game")
    private List<GameSlot> slots;

    @OneToOne(mappedBy="game", cascade = CascadeType.ALL)
    private GameSlotConfig config;

}
