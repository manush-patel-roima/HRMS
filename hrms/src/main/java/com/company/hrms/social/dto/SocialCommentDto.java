package com.company.hrms.social.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class SocialCommentDto {
    private Long id;
    private Integer commenterId;
    private String commenterName;
    private String text;
    private LocalDateTime createdAt;
}

