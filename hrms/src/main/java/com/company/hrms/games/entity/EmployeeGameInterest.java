package com.company.hrms.games.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "EmployeeGameInterests")
@Getter
@Setter
public class EmployeeGameInterest {

    @EmbeddedId
    private EmployeeGameInterestKey id;


    @MapsId("employeeId")
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;


    @MapsId("gameId")
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;




    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeGameInterestKey implements Serializable {

        @Column(name = "employee_id")
        private Integer employeeId;

        @Column(name = "game_id")
        private Integer gameId;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof EmployeeGameInterestKey)) return false;
            EmployeeGameInterestKey that = (EmployeeGameInterestKey) o;
            return Objects.equals(employeeId, that.employeeId)
                    && Objects.equals(gameId, that.gameId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(employeeId, gameId);
        }
    }
}