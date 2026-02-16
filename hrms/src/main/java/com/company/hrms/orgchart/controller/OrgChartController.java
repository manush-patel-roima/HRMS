package com.company.hrms.orgchart.controller;

import com.company.hrms.orgchart.dto.OrgChartResponse;
import com.company.hrms.orgchart.service.OrgChartService;
import com.company.hrms.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orgchart")
public class OrgChartController {

    private final OrgChartService orgChartService;

    public OrgChartController(OrgChartService orgChartService){
        this.orgChartService=orgChartService;
    }

    @GetMapping("/{employeeId}")
    public OrgChartResponse getOrgChart(@PathVariable Integer employeeId){
        return orgChartService.getOrgChart(employeeId);
    }

    @GetMapping("/me")
    public OrgChartResponse getMyOrgChart(@AuthenticationPrincipal CustomUserDetails user){
        return orgChartService.getOrgChart(user.getEmployeeId());
    }
}
