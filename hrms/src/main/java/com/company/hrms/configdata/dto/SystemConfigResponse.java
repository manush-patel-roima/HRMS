package com.company.hrms.configdata.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class SystemConfigResponse {

    private String configKey;
    private String configValue;
}