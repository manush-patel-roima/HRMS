package com.company.hrms.employee.repository;

import com.company.hrms.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findByManager_EmployeeId(Integer managerId);
}
