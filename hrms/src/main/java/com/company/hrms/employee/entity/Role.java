package com.company.hrms.employee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="Roles")
@Getter @Setter
public class Role {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer roleId;

    @Column(nullable=false, unique=true)
    private String roleName;

}
