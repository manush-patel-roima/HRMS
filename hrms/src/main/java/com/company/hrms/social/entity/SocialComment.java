package com.company.hrms.social.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "SocialComments", indexes = {
        @Index(name = "idx_social_comments_post", columnList = "post_id")
})
@Getter
@Setter
public class SocialComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private SocialPost post;

    @ManyToOne
    @JoinColumn(name = "commenter_id")
    private Employee commenter;

    @Column(columnDefinition = "TEXT")
    private String text;

    private LocalDateTime createdAt = LocalDateTime.now();

}

