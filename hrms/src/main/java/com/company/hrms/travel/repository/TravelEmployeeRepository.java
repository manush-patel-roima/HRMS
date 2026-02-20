package com.company.hrms.travel.repository;

import com.company.hrms.travel.entity.TravelEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface TravelEmployeeRepository extends JpaRepository<TravelEmployee,Integer> {
    List<TravelEmployee> findByEmployee_EmployeeId(Integer employeeId);
    List<TravelEmployee> findByEmployee_EmployeeIdIn(List<Integer> employeeIds);

    @Query("""
          SELECT te FROM TravelEmployee te 
          WHERE te.employee.employeeId IN :employeeIds
          AND te.travelPlan.startDate <= :newEndDate
          AND te.travelPlan.endDate >= :newStartDate
    """)
    List<TravelEmployee> findOverlappingTravels(
            List<Integer> employeeIds,
            LocalDate newStartDate,
            LocalDate newEndDate
    );
}
