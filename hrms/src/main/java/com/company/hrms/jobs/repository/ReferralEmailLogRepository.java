package com.company.hrms.jobs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.jobs.entity.ReferralEmailLog;

public interface ReferralEmailLogRepository extends JpaRepository<ReferralEmailLog, Integer> {
}
