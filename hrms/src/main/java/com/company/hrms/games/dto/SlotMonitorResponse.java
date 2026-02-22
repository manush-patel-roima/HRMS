package com.company.hrms.games.dto;

import com.company.hrms.games.entity.SlotStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SlotMonitorResponse {

    private Integer slotId;
    private String gameName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
    private List<String> participants;
}
