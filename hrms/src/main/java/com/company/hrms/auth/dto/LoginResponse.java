package com.company.hrms.auth.dto;

import lombok.*;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String role;
}
