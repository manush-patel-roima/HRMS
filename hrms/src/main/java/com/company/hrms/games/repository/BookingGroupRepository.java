package com.company.hrms.games.repository;

import com.company.hrms.games.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingGroupRepository
        extends JpaRepository<BookingGroup, Integer> {

    List<BookingGroup> findBySlot_SlotIdAndBookingStatus(
            Integer slotId,
            BookingStatus status
    );
}
