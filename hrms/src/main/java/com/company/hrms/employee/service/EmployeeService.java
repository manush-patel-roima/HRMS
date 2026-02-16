package com.company.hrms.employee.service;

import com.company.hrms.employee.dto.EmployeeListResponse;
import com.company.hrms.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepo;

    public EmployeeService(EmployeeRepository employeeRepo){
        this.employeeRepo=employeeRepo;
    }

    public List<EmployeeListResponse> getAllEmployees(){
        return employeeRepo.findAll()
                .stream()
                .map(e->new EmployeeListResponse(
                        e.getEmployeeId(),
                        e.getFullName()
                ))
                .toList();
    }


    public List<EmployeeListResponse> getAllEmployeesExceptManagerAndHr(){
        return employeeRepo.findAll()
                .stream()
                .filter(e->e.getRole().getRoleName().equals("EMPLOYEE"))
                .map(e->new EmployeeListResponse(
                        e.getEmployeeId(),
                        e.getFullName()
                ))
                .toList();
    }


}
