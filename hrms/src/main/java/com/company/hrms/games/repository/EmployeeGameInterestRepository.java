package com.company.hrms.games.repository;

import com.company.hrms.games.entity.EmployeeGameInterest;
import com.company.hrms.games.entity.EmployeeGameInterest.EmployeeGameInterestKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeGameInterestRepository
        extends JpaRepository<EmployeeGameInterest, EmployeeGameInterestKey> {

    boolean existsByEmployee_EmployeeIdAndGame_GameId(
            Integer employeeId,
            Integer gameId
    );

    List<EmployeeGameInterest> findByGame_GameId(Integer gameId);
}
