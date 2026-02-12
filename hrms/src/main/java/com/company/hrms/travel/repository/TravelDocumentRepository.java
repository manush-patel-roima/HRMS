package com.company.hrms.travel.repository;

import com.company.hrms.travel.entity.TravelDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelDocumentRepository extends JpaRepository<TravelDocument,Integer> {
    List<TravelDocument> findByTravelPlan_TravelId(Integer travelId);
    List<TravelDocument> findByEmployee_EmployeeId(Integer employeeId);
}
