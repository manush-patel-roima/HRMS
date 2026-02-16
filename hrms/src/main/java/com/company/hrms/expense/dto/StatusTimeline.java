package com.company.hrms.expense.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class StatusTimeline {

    private String status;
    private String changedBy;
    private LocalDateTime changedAt;
    private String remark;
}
