package com.company.hrms.games.dto;

import com.company.hrms.games.entity.SlotStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
public class GameSlotByIdResponse {

    private Integer slotId;

    private Integer gameId;

    private String gameName;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private SlotStatus slotStatus;

    private Integer minPlayers;

    private Integer maxPlayers;
}