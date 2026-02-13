package com.company.hrms.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
@AllArgsConstructor
public class ExpenseListResponse {

    private Integer expenseId;
    private String travelTitle;
    private BigDecimal amount;
    private String status;
}
