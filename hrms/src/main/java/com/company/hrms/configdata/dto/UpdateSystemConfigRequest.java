package com.company.hrms.configdata.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class UpdateSystemConfigRequest {

    @NotBlank
    private String configValue;
}
