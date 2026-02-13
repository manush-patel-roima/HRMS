package com.company.hrms.expense.dto;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class UpdateExpenseStatusRequest {
    private String statusCode;
    private String remark;
}
