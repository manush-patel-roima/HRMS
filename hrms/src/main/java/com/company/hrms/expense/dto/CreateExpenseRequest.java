package com.company.hrms.expense.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter@Setter
public class CreateExpenseRequest {

    private Integer travelId;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;

}
