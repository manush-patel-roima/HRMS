package com.company.hrms.social.repository;

import com.company.hrms.social.entity.SocialPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface SocialPostRepository extends JpaRepository<SocialPost, Long> {

    Page<SocialPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<SocialPost> findByAuthor_EmployeeIdOrderByCreatedAtDesc(Integer authorId, Pageable pageable);

    @Query("select p from SocialPost p where p.isSystemGenerated = true and p.postType = :postType and p.relatedEmployee.employeeId = :relatedEmployeeId and p.systemPostDate = :date")
    Optional<SocialPost> findSystemPostByTypeAndRelatedEmployeeAndDate(@Param("postType") String postType,
                                                                       @Param("relatedEmployeeId") Integer relatedEmployeeId,
                                                                       @Param("date") LocalDate date);

}

