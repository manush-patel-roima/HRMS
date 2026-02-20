//package com.company.hrms.games.entity;
//
//import com.company.hrms.employee.entity.Employee;
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "PlayerGameStats")
//@Getter
//@Setter
//@IdClass(PlayerGameStatsId.class)
//public class PlayerGameStats {
//
//    @Id
//    @ManyToOne
//    @JoinColumn(name = "EmployeeId")
//    private Employee employee;
//
//    @Id
//    @ManyToOne
//    @JoinColumn(name = "GameId")
//    private Game game;
//
//    private Integer completedSlots = 0;
//
//    private Integer cycleNumber = 1;
//}
