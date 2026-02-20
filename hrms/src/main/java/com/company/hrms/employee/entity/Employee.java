package com.company.hrms.employee.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity@Table(name="Employees")
@Getter @Setter
public class Employee {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer employeeId;

    private String fullName;
    private String email;
    private String passwordHash;

    @ManyToOne
    @JoinColumn(name="RoleId")
    private Role role;

    @ManyToOne
    @JoinColumn(name="ManagerId")
    private Employee manager;

    private String department;
    private String designation;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private Boolean isActive=true;
    private LocalDateTime createdAt=LocalDateTime.now();

    private String profileImageUrl;

}
