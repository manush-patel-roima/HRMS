package com.company.hrms.expense.controller;

import com.company.hrms.expense.dto.CreateExpenseRequest;
import com.company.hrms.expense.dto.ExpenseListResponse;
import com.company.hrms.expense.dto.ExpenseResponse;
import com.company.hrms.expense.dto.UpdateExpenseStatusRequest;
import com.company.hrms.expense.service.ExpenseService;
import com.company.hrms.security.CustomUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService){
        this.expenseService=expenseService;
    }

    @PostMapping
    public ExpenseResponse createExpense(
            @RequestParam("data")CreateExpenseRequest request,
            @RequestParam("proof")MultipartFile proof,
            @AuthenticationPrincipal CustomUserDetails user
            )
    {
        return expenseService.createExpense(request,proof,user.getEmployeeId());
    }

    @GetMapping
    public List<ExpenseListResponse> listExpenses(@AuthenticationPrincipal CustomUserDetails user){
        return Collections.singletonList(expenseService.listExpenses(user.getEmployeeId()));
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/{id}/status")
    public ExpenseResponse updateStatus(
            @PathVariable Integer id,
            @RequestBody UpdateExpenseStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        return expenseService.updateStatus(
                id,
                request,
                user.getEmployeeId()
        );
    }


}
