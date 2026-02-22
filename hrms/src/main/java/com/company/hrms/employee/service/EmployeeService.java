package com.company.hrms.employee.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.employee.dto.EmployeeListResponse;
import com.company.hrms.employee.dto.EmployeeResponse;
import com.company.hrms.employee.entity.Employee;
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


    public EmployeeResponse getEmployeeByEmail(String email){
        Employee e = employeeRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Integer managerId = null;
        String managerName = null;
        if(e.getManager()!=null){
            managerId = e.getManager().getEmployeeId();
            managerName = e.getManager().getFullName();
        }

        String roleName = e.getRole()!=null ? e.getRole().getRoleName() : null;

        return new EmployeeResponse(
                e.getEmployeeId(),
                e.getFullName(),
                e.getEmail(),
                roleName,
                managerId,
                managerName,
                e.getDepartment(),
                e.getDesignation(),
                e.getDateOfJoining(),
                e.getProfileImageUrl()
        );
    }


}
