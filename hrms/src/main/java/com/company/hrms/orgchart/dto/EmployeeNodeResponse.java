package com.company.hrms.orgchart.dto;

import lombok.*;

@Getter @Setter@AllArgsConstructor
public class EmployeeNodeResponse {
    private Integer employeeId;
    private String fullName;
    private String designation;
    private String department;
    private String profileImageUrl;
}
