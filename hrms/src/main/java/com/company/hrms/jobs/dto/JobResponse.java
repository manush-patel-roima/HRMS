package com.company.hrms.jobs.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class JobResponse {

    private Integer jobId;
    private String title;
    private String description;
    private String jdFileUrl;
    private Boolean isActive;
}