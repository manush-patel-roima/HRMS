package com.company.hrms.games.dto;

import com.company.hrms.games.entity.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MyBookingResponse {

    private Integer bookingGroupId;
    private String gameName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> participants;
    private BookingStatus status;
}
