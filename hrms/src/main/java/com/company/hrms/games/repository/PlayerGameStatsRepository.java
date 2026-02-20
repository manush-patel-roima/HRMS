//package com.company.hrms.games.repository;
//
//import com.company.hrms.games.entity.PlayerGameStats;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface PlayerGameStatsRepository
//        extends JpaRepository<PlayerGameStats, Integer> {
//
//    Optional<PlayerGameStats> findByEmployee_EmployeeIdAndGame_GameId(
//            Integer employeeId,
//            Integer gameId
//    );
//}
