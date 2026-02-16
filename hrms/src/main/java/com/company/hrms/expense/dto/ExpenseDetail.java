package com.company.hrms.expense.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class ExpenseDetail {

    private Integer expenseId;
    private String employeeName;
    private String travelTitle;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String status;
    private String hrRemark;
    private List<String> proofs;
    private List<StatusTimeline> timeline;
}
