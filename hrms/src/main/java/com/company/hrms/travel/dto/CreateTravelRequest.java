package com.company.hrms.travel.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class CreateTravelRequest {

    private String title;
    private LocalDate startDate;
    private LocalDate endDate;

    private List<Integer> employeeIds;
}
