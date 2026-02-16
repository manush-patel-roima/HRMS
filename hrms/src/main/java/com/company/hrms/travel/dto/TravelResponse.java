package com.company.hrms.travel.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class TravelResponse {

    private Integer travelId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String createdByHR;
    private List<EmployeeSummary> assignedEmployees;
}
