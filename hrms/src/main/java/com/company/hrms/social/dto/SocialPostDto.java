package com.company.hrms.social.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class SocialPostDto {
    private Long id;
    private Integer authorId;
    private String authorName;
    private String title;
    private String description;
    private String tags;
    private LocalDateTime createdAt;
    private String visibility;
    private Boolean isSystemGenerated;
    private String postType;
    private Integer relatedEmployeeId;
    private int likeCount;
    private int commentCount;
    private boolean likedByCurrentUser;
    private List<SocialCommentDto> comments;
}

