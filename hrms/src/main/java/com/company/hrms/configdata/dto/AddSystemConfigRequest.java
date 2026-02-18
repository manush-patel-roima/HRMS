package com.company.hrms.configdata.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class AddSystemConfigRequest {

    @NotBlank
    private String configKey;

    @NotBlank
    private String configValue;
}
