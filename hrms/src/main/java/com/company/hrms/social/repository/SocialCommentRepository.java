package com.company.hrms.social.repository;

import com.company.hrms.social.entity.SocialComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SocialCommentRepository extends JpaRepository<SocialComment, Long> {
    List<SocialComment> findByPost_IdOrderByCreatedAtAsc(Long postId);
}

