package com.company.hrms.games.repository;

import com.company.hrms.games.entity.BookingQueue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingQueueRepository
        extends JpaRepository<BookingQueue, Integer> {

    List<BookingQueue> findByBookingGroup_Slot_SlotIdOrderByAddedAtAsc(Integer slotId);
}
