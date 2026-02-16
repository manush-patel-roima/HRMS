package com.company.hrms.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class EmployeeListResponse {

    private Integer employeeId;
    private String employeeName;
}
