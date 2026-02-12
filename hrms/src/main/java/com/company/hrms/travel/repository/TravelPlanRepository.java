package com.company.hrms.travel.repository;

import com.company.hrms.travel.entity.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelPlanRepository extends JpaRepository<TravelPlan,Integer> {
}
