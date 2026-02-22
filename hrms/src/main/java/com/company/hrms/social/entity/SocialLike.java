package com.company.hrms.social.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "SocialLikes", uniqueConstraints = {
        @UniqueConstraint(name = "uk_like_post_employee", columnNames = {"post_id", "employee_id"})
}, indexes = {
        @Index(name = "idx_social_likes_post", columnList = "post_id")
})
@Getter
@Setter
public class SocialLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private SocialPost post;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime createdAt = LocalDateTime.now();

}

