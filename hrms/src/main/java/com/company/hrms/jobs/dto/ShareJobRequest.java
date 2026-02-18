package com.company.hrms.jobs.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
public class ShareJobRequest {

    @NotNull
    private Integer jobId;

    @NotEmpty
    private List<@Email String> recipientEmails;
}
