package com.company.hrms.games.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
public class BookingRequest {

    private Integer slotId;

    private List<Integer> participantIds;
}
