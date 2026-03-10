package com.company.hrms.expense.repository;

import com.company.hrms.expense.entity.Expense;
import com.company.hrms.expense.entity.ExpenseProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    List<Expense> findByEmployee_EmployeeId(Integer employeeId);
    List<Expense> findByEmployee_Manager_EmployeeId(Integer managerId);

    List<Expense> findByTravelPlan_TravelId(Integer travelId);
    List<Expense> findByTravelPlan_TravelIdAndEmployee_EmployeeId(Integer travelId,Integer employeeId);
    void deleteByTravelPlan_TravelId(Integer travelId);

    @Query("""
          SELECT e FROM Expense e
          WHERE (:employeeName IS NULL OR
                 LOWER(e.employee.fullName) LIKE LOWER(CONCAT('%', :employeeName, '%')))
            AND (:status IS NULL OR e.status.statusCode = :status)
            AND (:travelId IS NULL OR e.travelPlan.travelId = :travelId)
            AND (:fromDate IS NULL OR e.expenseDate >= :fromDate)
            AND (:toDate IS NULL OR e.expenseDate <= :toDate)                                     
    """)
    List<Expense> filterExpenses(
            String employeeName,
            String status,
            Integer travelId,
            LocalDate fromDate,
            LocalDate toDate
    );

    void deleteByTravelPlan_TravelIdAndEmployee_EmployeeId(
            Integer travelId,
            Integer employeeId
    );

}
