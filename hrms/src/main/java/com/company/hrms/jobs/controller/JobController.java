package com.company.hrms.jobs.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.company.hrms.jobs.service.JobService;
import com.company.hrms.jobs.dto.*;
import com.company.hrms.security.CustomUserDetails;

@RestController
@RequestMapping("/api/jobs")
@Validated
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobResponse> listJobs() {
        return jobService.listActiveJobs();
    }

    @PreAuthorize("hasRole('HR')")
    @PostMapping
    public JobResponse createJob(
            @RequestPart("data") @Validated CreateJobRequest request,
            @RequestPart(value = "jdFile", required = false) MultipartFile jdFile) {

        return jobService.createJob(request, jdFile);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/share")
    public void shareJob(
            @RequestBody @Validated ShareJobRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        jobService.shareJob(request, user.getEmployeeId());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/refer")
    public ReferralResponse createReferral(
            @RequestPart("data") @Validated CreateReferralRequest request,
            @RequestPart("cvFile") MultipartFile cvFile,
            @AuthenticationPrincipal CustomUserDetails user) {

        return jobService.createReferral(request, cvFile, user.getEmployeeId());
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/referrals/{id}")
    public ReferralResponse updateStatus(
            @PathVariable Integer id,
            @RequestBody @Validated UpdateReferralStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        return jobService.updateReferralStatus(id, request, user.getEmployeeId());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my-referrals")
    public List<ReferralResponse> myReferrals(@AuthenticationPrincipal CustomUserDetails user) {

        return jobService.listMyReferrals(user.getEmployeeId());
    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/referrals")
    public List<ReferralResponse> allReferrals() {
        return jobService.listAllReferrals();
    }


    @PreAuthorize("hasRole('HR')")
    @PutMapping("/{jobId}/deactivate")
    public void deactivateJob(@PathVariable Integer jobId) {
        jobService.deactivateJob(jobId);
    }
}