package com.company.hrms.orgchart.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class OrgChartResponse {
    private EmployeeNodeResponse selectedEmployee;
    private List<EmployeeNodeResponse> managerChain;
    private List<EmployeeNodeResponse> directReports;
}
