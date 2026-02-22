package com.company.hrms.games.repository;

import com.company.hrms.games.entity.SlotParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlotParticipantRepository
        extends JpaRepository<SlotParticipant, Integer> {

    List<SlotParticipant> findByBookingGroup_BookingGroupId(Integer id);
}
