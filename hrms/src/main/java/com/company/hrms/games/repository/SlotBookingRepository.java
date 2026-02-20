//package com.company.hrms.games.repository;
//
//import com.company.hrms.games.entity.SlotBooking;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface SlotBookingRepository extends JpaRepository<SlotBooking, Integer> {
//
//    Integer countBySlot_SlotId(Integer slotId);
//
//    boolean existsByEmployee_EmployeeIdAndSlot_SlotDate(
//            Integer employeeId,
//            LocalDate date
//    );
//
//    List<SlotBooking> findByEmployee_EmployeeIdAndBookingStatus(
//            Integer employeeId,
//            String status
//    );
//}
