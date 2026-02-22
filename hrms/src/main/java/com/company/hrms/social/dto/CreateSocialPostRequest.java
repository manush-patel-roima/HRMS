package com.company.hrms.social.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSocialPostRequest {
    private String title;
    private String description;
    private String tags;
    private String postType;
    private Integer relatedEmployeeId;
}

