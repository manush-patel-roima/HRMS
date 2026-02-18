package com.company.hrms.configdata.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.configdata.entity.SystemConfig;

public interface SystemConfigRepository extends JpaRepository<SystemConfig, String> {
    boolean existsByConfigKey(String configKey);
}
