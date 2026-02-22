package com.company.hrms.games.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class GameResponse {

    private Integer gameId;

    private String gameName;

    private boolean interested;

    private Integer playedCount;
}