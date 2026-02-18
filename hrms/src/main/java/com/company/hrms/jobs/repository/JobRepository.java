package com.company.hrms.jobs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.jobs.entity.Job;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByIsActiveTrue();
}