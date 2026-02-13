package com.company.hrms.configdata.repository;

import com.company.hrms.configdata.entity.StatusMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusMasterRepository extends JpaRepository<StatusMaster,Integer> {
    Optional<StatusMaster> findByModuleAndStatusCode(String module, String statusCode);
}
