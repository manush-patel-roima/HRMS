package com.company.hrms.jobs.dto;

import lombok.*;
import java.time.LocalDateTime;
import com.company.hrms.jobs.entity.ReferralStatus;

@Getter
@Setter
@AllArgsConstructor
public class ReferralResponse {

    private Integer referralId;
    private String referrer;
    private String jobName;
    private String friendName;
    private String friendEmail;
    private ReferralStatus status;
    private LocalDateTime createdAt;
}
