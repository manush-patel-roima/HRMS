package com.company.hrms.jobs.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
public class CreateJobRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @Email
    private String hrContactEmail;

    private List<@Email String> reviewerEmails;
}