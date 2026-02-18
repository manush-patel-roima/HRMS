package com.company.hrms.configdata.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.ValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import com.company.hrms.configdata.entity.SystemConfig;
import com.company.hrms.configdata.repository.SystemConfigRepository;
import com.company.hrms.configdata.dto.*;

@Service
public class SystemConfigService {

    private final SystemConfigRepository repository;

    public SystemConfigService(SystemConfigRepository repository) {
        this.repository = repository;
    }

    public List<SystemConfigResponse> getAllConfigs() {

        return repository.findAll()
                .stream()
                .map(config ->
                        new SystemConfigResponse(
                                config.getConfigKey(),
                                config.getConfigValue()))
                .toList();
    }

    @Transactional
    public void addConfig(AddSystemConfigRequest request){

        if(repository.existsByConfigKey(request.getConfigKey())){
            throw new ValidationException("Config key already exists");
        }
        SystemConfig systemConfig = new SystemConfig();
        systemConfig.setConfigKey(request.getConfigKey().trim());
        systemConfig.setConfigValue(request.getConfigValue().trim());

        repository.save(systemConfig);
    }

    @Transactional
    public void updateConfig(String key, UpdateSystemConfigRequest request) {

        SystemConfig config = repository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Config not found"));

        config.setConfigValue(request.getConfigValue());

        repository.save(config);
    }

    public String getConfigValue(String key) {

        return repository.findById(key)
                .map(SystemConfig::getConfigValue)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Config not found"));
    }
}
