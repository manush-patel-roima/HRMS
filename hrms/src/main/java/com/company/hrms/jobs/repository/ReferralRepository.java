package com.company.hrms.jobs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.jobs.entity.Referral;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Integer> {

    @Query("""
          SELECT r FROM Referral r 
          WHERE r.referrerEmployeeId = :employeeId
          AND r.job.isActive = true
    """)
    List<Referral> findActiveReferralsByEmployeeId(@Param("employeeId") Integer employeeId);


    @Query("""
          SELECT r FROM Referral r
          WHERE r.job.isActive = true
    """)
    List<Referral> findAllActiveReferrals();
}