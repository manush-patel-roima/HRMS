package com.company.hrms.expense.entity;

import com.company.hrms.configdata.entity.StatusMaster;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.travel.entity.TravelPlan;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="Expenses")
@Getter @Setter
public class Expense {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer expenseId;

    @ManyToOne
    @JoinColumn(name="TravelId",nullable = false)
    private TravelPlan travelPlan;

    @ManyToOne
    @JoinColumn(name="EmployeeId",nullable = false)
    private Employee employee;

    private String category;

    private BigDecimal amount;

    private LocalDate expenseDate;

    @ManyToOne
    @JoinColumn(name="StatusId",nullable = false)
    private StatusMaster status;

    private String hrRemark;

    @ManyToOne
    @JoinColumn(name="ActionByHR")
    private Employee actionByHR;

    private LocalDateTime actionAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy="expense",cascade = CascadeType.ALL)
    private List<ExpenseProof> proofs;

}
