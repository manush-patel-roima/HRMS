package com.company.hrms.expense.controller;

import com.company.hrms.expense.dto.ExpenseDetail;
import com.company.hrms.expense.dto.ExpenseSummary;
import com.company.hrms.expense.service.ExpenseService;
import com.company.hrms.security.CustomUserDetails;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr/expenses")
@PreAuthorize("hasRole('HR')")
public class HRExpenseController {

    private final ExpenseService expenseService;

    public HRExpenseController(ExpenseService expenseService)
    {
        this.expenseService = expenseService;
    }



    @GetMapping
    public List<ExpenseSummary> filter(
//            @RequestParam(required = false) Integer employeeId,
            @RequestParam(required = false) String employeeName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer travelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    )
    {
        return expenseService.filterExpenses(employeeName, status, travelId, from, to);
    }



    @GetMapping("/{id}")
    public ExpenseDetail detail(@PathVariable Integer id)
    {
        return expenseService.getExpenseDetailForHR(id);
    }



    @PutMapping("/{id}/approve")
    public ExpenseDetail approve(@PathVariable Integer id, @AuthenticationPrincipal CustomUserDetails user)
    {
        return expenseService.approveExpense(id, user.getEmployeeId());
    }



    @PutMapping("/{id}/reject")
    public ExpenseDetail reject(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails user
    )
    {
        return expenseService.rejectExpense(id, user.getEmployeeId(), body.get("remark"));
    }

}
