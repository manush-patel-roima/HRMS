package com.company.hrms.games.scheduler;

import com.company.hrms.games.service.GameService;
import org.springframework.scheduling.annotation.*;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class GameScheduler {

    private final GameService service;

    public GameScheduler(GameService service) {
        this.service = service;
    }


    @Scheduled(cron = "0 * * * * *")
    public void runPendingAllocation() {
        service.processPendingAllocations();
    }


    @Scheduled(cron = "0 * * * * *")
    public void closeSlots() {
        service.closeFinishedSlots();
    }


    @Scheduled(cron = "0 15 12 * * *")
    public void generateDailySlots() {
        System.out.println("Running TEMP slot generation at 12:15 PM");
        service.generateSlotsForTomorrow();
    }
}
