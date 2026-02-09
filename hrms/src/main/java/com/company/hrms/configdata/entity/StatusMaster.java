package com.company.hrms.configdata.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="StatusMaster")
@Getter @Setter
public class StatusMaster {

    @Id@GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer statusId;

    private String module;
    private String statusCode;

}
