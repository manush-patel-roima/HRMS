package com.company.hrms.social.repository;

import com.company.hrms.social.entity.SocialLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLikeRepository extends JpaRepository<SocialLike, Long> {
    long countByPost_Id(Long postId);
    boolean existsByPost_IdAndEmployee_EmployeeId(Long postId, Integer employeeId);
    void deleteByPost_IdAndEmployee_EmployeeId(Long postId, Integer employeeId);
}

