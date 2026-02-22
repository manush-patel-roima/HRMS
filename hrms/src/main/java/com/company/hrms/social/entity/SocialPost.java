package com.company.hrms.social.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SocialPosts", indexes = {
        @Index(name = "idx_social_posts_author", columnList = "author_id"),
        @Index(name = "idx_social_posts_type_created", columnList = "postType, createdAt")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_system_post_per_day", columnNames = {"isSystemGenerated", "postType", "related_employee_id", "systemPostDate"})
})
@Getter
@Setter
public class SocialPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Employee author;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String tags;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String visibility = "ALL";

    private Boolean isSystemGenerated = false;

    private String postType;

    @ManyToOne
    @JoinColumn(name = "related_employee_id")
    private Employee relatedEmployee;

    private LocalDate systemPostDate;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.company.hrms.social.entity.SocialComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.company.hrms.social.entity.SocialLike> likes = new ArrayList<>();

}
