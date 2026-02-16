package com.company.hrms.expense.controller;

import com.company.hrms.expense.dto.ExpenseDetail;
import com.company.hrms.expense.dto.TravelGroupedExpense;
import com.company.hrms.expense.service.ExpenseService;
import com.company.hrms.security.CustomUserDetails;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employee/expenses")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeExpenseController {

    private final ExpenseService expenseService;

    public EmployeeExpenseController(ExpenseService expenseService)
    {
        this.expenseService = expenseService;
    }



    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ExpenseDetail createDraft(
            @RequestParam("travelId") Integer travelId,
            @RequestParam("category") String category,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("expenseDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expenseDate,
            @RequestParam("proofs") List<MultipartFile> proofs,
            @AuthenticationPrincipal CustomUserDetails user
    )
    {

        return expenseService.createDraft(
                user.getEmployeeId(),
                travelId,
                category,
                amount,
                expenseDate,
                proofs
        );
    }



    @PutMapping("/{id}/submit")
    public ExpenseDetail submit(@PathVariable Integer id, @AuthenticationPrincipal CustomUserDetails user)
    {
        return expenseService.submitExpense(id, user.getEmployeeId());
    }



    @GetMapping
    public List<TravelGroupedExpense> myExpenses(@AuthenticationPrincipal CustomUserDetails user)
    {
        return expenseService.getGroupedExpenses(user.getEmployeeId());
    }



    @GetMapping("/{id}")
    public ExpenseDetail getDetail(@PathVariable Integer id, @AuthenticationPrincipal CustomUserDetails user)
    {
        return expenseService.getExpenseDetailForEmployee(id, user.getEmployeeId());
    }
}
