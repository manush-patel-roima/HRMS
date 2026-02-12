package com.company.hrms.travel.repository;

import com.company.hrms.travel.entity.TravelEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelEmployeeRepository extends JpaRepository<TravelEmployee,Integer> {
    List<TravelEmployee> findByEmployee_EmployeeId(Integer employeeId);
    List<TravelEmployee> findByEmployee_EmployeeIdIn(List<Integer> employeeIds);
}
