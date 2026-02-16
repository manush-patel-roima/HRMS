package com.company.hrms.expense.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "expense_validation_config")
@Getter @Setter
public class ExpenseValidationConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private BigDecimal maxPerDayAmount;

    private Boolean isCategoryMandatory;
}
