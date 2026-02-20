//package com.company.hrms.games.service;
//
//import com.company.hrms.common.exception.ResourceNotFoundException;
//import com.company.hrms.games.dto.GameSlotResponse;
//import com.company.hrms.games.entity.GameSlot;
//import com.company.hrms.games.entity.GameSlotConfig;
//import com.company.hrms.games.repository.*;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//
//@Service
//
//public class GameService {
//
//    private final GameRepository gameRepo;
//    private final GameSlotConfigRepository configRepo;
//    private final GameSlotRepository slotRepo;
//    private final SlotBookingRepository bookingRepo;
//    private final EmployeeGameInterestRepository interestRepo;
//    private final PlayerGameStatsRepository statsRepo;
//
//    public GameService(GameRepository gameRepo,
//                       GameSlotConfigRepository configRepo,
//                       GameSlotRepository slotRepo,
//                       SlotBookingRepository bookingRepo,
//                       EmployeeGameInterestRepository interestRepo,
//                       PlayerGameStatsRepository statsRepo
//    )
//    {
//        this.gameRepo=gameRepo;
//        this.configRepo=configRepo;
//        this.slotRepo=slotRepo;
//        this.bookingRepo=bookingRepo;
//        this.interestRepo=interestRepo;
//        this.statsRepo=statsRepo;
//    }
//
//
//    @Transactional
//    public void generateSlots(Integer gameId, LocalDate date){
//
//        GameSlotConfig config = configRepo.findByGame_GameId(gameId)
//                .orElseThrow(()->new ResourceNotFoundException("Config not found"));
//
//        LocalTime start = LocalTime.parse("09.00");
//        LocalTime end = LocalTime.parse("18.00");
//
//        int duration = config.getSlotDurationMinutes();
//
//        while(start.plusMinutes(duration).isBefore(end)){
//
//            GameSlot slot = new GameSlot();
//            slot.setGame(gameRepo.findById(gameId).orElseThrow(()->new ResourceNotFoundException("Game not found")));
//            slot.setSlotDate(date);
//            slot.setStartTime(start);
//            slot.setEndTime(start.plusMinutes(duration));
//
//            slotRepo.save(slot);
//
//            start = start.plusMinutes(duration);
//        }
//
//    }
//
//    public List<GameSlotResponse> getSlots(Integer gameId, LocalDate date){
//
//        GameSlotConfig config = configRepo.findByGame_GameId(gameId)
//                .orElseThrow(()->new ResourceNotFoundException("config not found"));
//
//        return slotRepo.findByGame_GameIdAndSlotDate(gameId, date)
//                .stream()
//                .map(slot->new GameSlotResponse(
//                        slot.getSlotId(),
//                        slot.getSlotDate(),
//                        slot.getStartTime(),
//                        slot.getEndTime(),
//                        bookingRepo.countBySlot_SlotId(slot.getSlotId()),
//                        config.getMaxPlayers()
//                ))
//                .toList();
//    }
//
//
//
//
//}
//
//
//
//
