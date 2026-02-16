package com.company.hrms.employee.controller;


import com.company.hrms.employee.dto.EmployeeListResponse;
import com.company.hrms.employee.service.EmployeeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService){
        this.employeeService=employeeService;
    }

    @GetMapping("/all")
    public List<EmployeeListResponse> getAllEmployees(){
        return employeeService.getAllEmployees();
    }

    @GetMapping
    public List<EmployeeListResponse> getAllEmployeesExceptManagerAndHr(){
        return employeeService.getAllEmployeesExceptManagerAndHr();
    }

}
