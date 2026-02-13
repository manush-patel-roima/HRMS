package com.company.hrms.expense.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="ExpenseProofs")
@Getter @Setter
public class ExpenseProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proofId;

    @ManyToOne
    @JoinColumn(name="ExpenseId",nullable = false)
    private Expense expense;

    private String fileUrl;

    private LocalDateTime uploadedAt = LocalDateTime.now();


}
