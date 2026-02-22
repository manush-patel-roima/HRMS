package com.company.hrms.games.repository;

import com.company.hrms.games.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Integer> {

    Optional<Game> findByGameName(String gameName);
}
