package com.company.hrms.social.scheduler;

import com.company.hrms.social.service.SocialService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SocialScheduler {

    private final SocialService socialService;

    public SocialScheduler(SocialService socialService){
        this.socialService = socialService;
    }

    // run daily at 1:00 AM
    @Scheduled(cron = "0 0 1 * * ?")
    public void runDailyCelebrations(){
        socialService.generateDailyCelebrationPosts();
    }

}

