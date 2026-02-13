package com.company.hrms.expense.repository;

import com.company.hrms.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense,Integer> {

    List<Expense> findByEmployee_EmployeeId(Integer employeeId);
    List<Expense> findByTravelPlan_TravelId(Integer travelId);
    List<Expense> findByEmployee_Manager_EmployeeId(Integer managerId);

}
