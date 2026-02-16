package com.company.hrms.orgchart.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.orgchart.dto.EmployeeNodeResponse;
import com.company.hrms.orgchart.dto.OrgChartResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrgChartService {

    private final EmployeeRepository employeeRepo;

    public OrgChartService(EmployeeRepository employeeRepo){
        this.employeeRepo=employeeRepo;
    }


    public OrgChartResponse getOrgChart(Integer employeeId){

        Employee selected = employeeRepo.findById(employeeId)
                .orElseThrow(()-> new ResourceNotFoundException("Employee not found"));

        EmployeeNodeResponse selectedNode = mapToNode(selected);

        List<EmployeeNodeResponse> managerChain = buildManagerChain(selected);

        List<EmployeeNodeResponse> directReports =
                employeeRepo
                        .findByManager_EmployeeId(employeeId)
                        .stream()
                        .map(this::mapToNode)
                        .toList();

        return new OrgChartResponse(selectedNode,managerChain,directReports);
    }


    private List<EmployeeNodeResponse> buildManagerChain(Employee employee){

        List<EmployeeNodeResponse> chain = new ArrayList<>();

        Employee current = employee.getManager();

        while(current != null){
            chain.add(mapToNode(current));
            current = current.getManager();
        }

        return chain;
    }


    private EmployeeNodeResponse mapToNode(Employee employee){
        return new EmployeeNodeResponse(
                employee.getEmployeeId(),
                employee.getFullName(),
                employee.getDesignation(),
                employee.getDepartment(),
                employee.getProfileImageUrl()
        );
    }
}
