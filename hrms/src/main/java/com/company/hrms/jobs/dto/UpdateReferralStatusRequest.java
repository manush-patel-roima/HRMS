package com.company.hrms.jobs.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.company.hrms.jobs.entity.ReferralStatus;

@Getter
@Setter
public class UpdateReferralStatusRequest {

    @NotNull
    private ReferralStatus status;
}
