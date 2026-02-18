package com.company.hrms.jobs.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class CreateReferralRequest {

    @NotNull
    private Integer jobId;

    @NotBlank
    private String friendName;

    @Email
    private String friendEmail;


    private String note;
}