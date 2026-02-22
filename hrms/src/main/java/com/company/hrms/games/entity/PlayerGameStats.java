package com.company.hrms.games.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
        import lombok.*;

        import java.time.LocalDate;

@Entity
@Table(name = "PlayerGameStats")
@Getter
@Setter
public class PlayerGameStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer statsId;

    @ManyToOne
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "GameId")
    private Game game;

    private LocalDate playDate;

    private Integer playedCount = 0;
}
