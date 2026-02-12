package com.company.hrms.travel.entity;

import com.company.hrms.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Table(name="TravelPlans")
public class TravelPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer travelId;

    private String title;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "CreatedByHR")
    private Employee createdByHR;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "travelPlan", cascade = CascadeType.ALL)
    private List<TravelEmployee> employees;


}
