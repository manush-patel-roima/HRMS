package com.company.hrms.jobs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.jobs.entity.Referral;
import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Integer> {
    List<Referral> findByReferrerEmployeeId(Integer employeeId);
}