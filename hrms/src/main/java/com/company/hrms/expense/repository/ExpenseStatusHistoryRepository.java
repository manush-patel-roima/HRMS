package com.company.hrms.expense.repository;

import com.company.hrms.expense.entity.ExpenseStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseStatusHistoryRepository extends JpaRepository<ExpenseStatusHistory, Integer> {

    List<ExpenseStatusHistory> findByExpense_ExpenseIdOrderByChangedAtAsc(Integer expenseId);
}
