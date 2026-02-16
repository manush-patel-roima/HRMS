package com.company.hrms.expense.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class TravelGroupedExpense {

    private Integer travelId;
    private String travelTitle;
    private BigDecimal totalAmount;
    private List<ExpenseSummary> expenses;
}
