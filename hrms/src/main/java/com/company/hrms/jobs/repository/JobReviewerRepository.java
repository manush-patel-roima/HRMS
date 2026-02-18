package com.company.hrms.jobs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.hrms.jobs.entity.JobReviewer;
import java.util.List;

public interface JobReviewerRepository extends JpaRepository<JobReviewer, Integer> {
    List<JobReviewer> findByJobJobId(Integer jobId);
}