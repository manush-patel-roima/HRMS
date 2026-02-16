package com.company.hrms.expense.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "expense_proofs")
@Getter @Setter
public class ExpenseProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proofId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @Column(nullable = false)
    private String fileUrl;

    @Column(nullable = false)
    private String fileType;

    private LocalDateTime uploadedAt = LocalDateTime.now();
}