package com.company.hrms.games.repository;

import com.company.hrms.games.entity.GameSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GameSlotRepository extends JpaRepository<GameSlot, Integer> {

    List<GameSlot> findByGame_GameId(Integer gameId);

    List<GameSlot> findByGame_GameIdAndSlotDate(Integer gameId, LocalDate date);
}