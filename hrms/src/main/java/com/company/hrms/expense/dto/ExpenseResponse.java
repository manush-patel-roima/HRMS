package com.company.hrms.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class ExpenseResponse {

    private Integer expenseId;
    private String employeeName;
    private String travelTitle;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String status;
    private String hrRemark;
    private List<String> proofs;
}
