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


    @Scheduled(cron = "0 5 * * * *")
    public void runPendingAllocation() {
        service.processPendingAllocations();
    }


    @Scheduled(cron = "0 5 * * * *")
    public void closeSlots() {
        service.closeFinishedSlots();
    }


    @Scheduled(cron = "0 0 22 * * *")
    public void generateDailySlots() {
        System.out.println("Running TEMP slot generation at 10:00 PM");
        service.generateSlotsForTomorrow();
    }
}
