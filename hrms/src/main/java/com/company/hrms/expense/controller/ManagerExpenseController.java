package com.company.hrms.expense.controller;

import com.company.hrms.expense.dto.ExpenseSummary;
import com.company.hrms.expense.service.ExpenseService;
import com.company.hrms.security.CustomUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager/expenses")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerExpenseController {

    private final ExpenseService expenseService;

    public ManagerExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseSummary> teamExpenses(@AuthenticationPrincipal CustomUserDetails user)
    {
        return expenseService.getTeamExpenses(user.getEmployeeId());
    }
}
