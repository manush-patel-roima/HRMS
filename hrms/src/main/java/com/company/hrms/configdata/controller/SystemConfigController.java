package com.company.hrms.configdata.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

import com.company.hrms.configdata.service.SystemConfigService;
import com.company.hrms.configdata.dto.*;

@RestController
@RequestMapping("/api/config")
@Validated
@PreAuthorize("hasRole('HR')")
public class SystemConfigController {

    private final SystemConfigService service;

    public SystemConfigController(SystemConfigService service) {
        this.service = service;
    }

    @GetMapping
    public List<SystemConfigResponse> getAllConfigs() {
        return service.getAllConfigs();
    }

    @PostMapping
    public void addConfig(@RequestBody @Validated AddSystemConfigRequest request) {
         service.addConfig(request);
    }

    @PutMapping("/{key}")
    public void updateConfig(
            @PathVariable String key,
            @RequestBody @Validated UpdateSystemConfigRequest request
    )
    {
        service.updateConfig(key, request);
    }
}
