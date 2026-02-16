package com.company.hrms.expense.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
@AllArgsConstructor
public class ExpenseSummary {

    private Integer expenseId;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String status;
}
