package com.company.hrms.travel.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@Table(name="TravelEmployees")
public class TravelEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer travelEmployeeId;

    @ManyToOne
    @JoinColumn(name = "TravelId", nullable = false)
    private TravelPlan travelPlan;

    @ManyToOne
    @JoinColumn(name = "EmployeeId", nullable = false)
    private Employee employee;
}
