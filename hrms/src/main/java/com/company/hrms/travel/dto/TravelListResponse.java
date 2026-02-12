package com.company.hrms.travel.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@AllArgsConstructor
public class TravelListResponse {

    private Integer travelId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
}
