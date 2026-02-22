package com.company.hrms.games.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class GameConfigResponse {

    private Integer gameId;

    private Integer slotDurationMinutes;

    private Integer minPlayers;

    private Integer maxPlayers;

    private String startHour;

    private String endHour;
}
