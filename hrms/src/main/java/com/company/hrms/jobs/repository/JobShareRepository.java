package com.company.hrms.jobs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.jobs.entity.JobShare;

public interface JobShareRepository extends JpaRepository<JobShare, Integer> {
}