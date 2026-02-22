package com.company.hrms.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
@AllArgsConstructor
public class EmployeeResponse {

    private Integer employeeId;
    private String fullName;
    private String email;
    private String role;
    private Integer managerId;
    private String managerName;
    private String department;
    private String designation;
    private LocalDate dateOfJoining;
    private String profileImageUrl;

}

