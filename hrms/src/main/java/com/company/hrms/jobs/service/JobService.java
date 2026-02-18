package com.company.hrms.jobs.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.ValidationException;
import com.company.hrms.common.util.CloudinaryService;
import com.company.hrms.configdata.service.SystemConfigService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.time.LocalDateTime;

import com.company.hrms.jobs.entity.*;

import com.company.hrms.jobs.dto.*;

import com.company.hrms.jobs.repository.*;
import com.company.hrms.jobs.email.JobEmailService;

@Service
public class JobService {

    private final JobRepository jobRepo;
    private final ReferralRepository referralRepo;
    private final JobReviewerRepository reviewerRepo;
    private final JobShareRepository shareRepo;
    private final JobEmailService emailService;
    private final CloudinaryService cloudinaryService;
    private final SystemConfigService configService;

    public JobService(
            JobRepository jobRepo,
            ReferralRepository referralRepo,
            JobReviewerRepository reviewerRepo,
            JobShareRepository shareRepo,
            JobEmailService emailService,
            CloudinaryService cloudinaryService,
            SystemConfigService configService
    ) {

        this.jobRepo = jobRepo;
        this.referralRepo = referralRepo;
        this.reviewerRepo = reviewerRepo;
        this.shareRepo = shareRepo;
        this.emailService = emailService;
        this.cloudinaryService=cloudinaryService;
        this.configService = configService;
    }



    public List<JobResponse> listActiveJobs() {
        return jobRepo.findByIsActiveTrue()
                .stream()
                .map(this::jobMapper)
                .toList();
    }




    @Transactional
    public JobResponse createJob(CreateJobRequest request, MultipartFile jdFile) {

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setHrContactEmail(request.getHrContactEmail());
        job.setIsActive(true);

        if (jdFile != null && !jdFile.isEmpty()) {
            String jdUrl = cloudinaryService.uploadJd(jdFile,request.getTitle());
            job.setJdFileUrl(jdUrl);
        }

        Job savedJob = jobRepo.save(job);

        if (request.getReviewerEmails() != null) {
            for (String email : request.getReviewerEmails()) {

                if (email != null && !email.isBlank()) {
                    JobReviewer reviewer = new JobReviewer();
                    reviewer.setJob(savedJob);
                    reviewer.setReviewerEmail(email.trim());
                    reviewerRepo.save(reviewer);
                }
            }
        }

        return jobMapper(savedJob);
    }




    @Transactional
    public void shareJob(ShareJobRequest request, Integer employeeId) {

        Job job = jobRepo.findById(request.getJobId())
                .orElseThrow(()->new ResourceNotFoundException("Job not found"));

        emailService.sendJobShareEmail(
                request.getRecipientEmails(), job);

        request.getRecipientEmails().forEach(email -> {
            JobShare share = new JobShare();
            share.setJob(job);
            share.setSharedByEmployeeId(employeeId);
            share.setRecipientEmail(email);
            shareRepo.save(share);
        });
    }




    @Transactional
    public ReferralResponse createReferral(CreateReferralRequest request, MultipartFile cvFile, Integer employeeId) {

        validateCV(cvFile);

        Job job = jobRepo.findById(request.getJobId())
                .orElseThrow(()->new ResourceNotFoundException("Job not found"));

        Referral referral = new Referral();
        referral.setJob(job);
        referral.setReferrerEmployeeId(employeeId);
        referral.setFriendName(request.getFriendName());
        referral.setFriendEmail(request.getFriendEmail());
        referral.setNote(request.getNote());
        if (!cvFile.isEmpty()) {
            String cvUrl = cloudinaryService.uploadReferralCv(cvFile,request.getFriendName());
            referral.setCvFileUrl(cvUrl);
        }

        referralRepo.save(referral);

        List<String> recipients = new ArrayList<>();

        if (job.getHrContactEmail() != null)
            recipients.add(job.getHrContactEmail());

        String defaultHrEmail =
                configService.getConfigValue("DEFAULT_HR_EMAIL");

        recipients.add(defaultHrEmail);


        reviewerRepo.findByJobJobId(job.getJobId())
                .forEach(r -> recipients.add(r.getReviewerEmail()));

        emailService.sendReferralNotification(referral, recipients);

        return referralMapper(referral);
    }




    @Transactional
    public ReferralResponse updateReferralStatus(Integer referralId, UpdateReferralStatusRequest request, Integer hrId) {

        Referral referral = referralRepo.findById(referralId)
                .orElseThrow(()->new ResourceNotFoundException("Referral not found"));

        validate(referral.getStatus(), request.getStatus());

        referral.setStatus(request.getStatus());
        referral.setReviewedBy(hrId);
        referral.setReviewedAt(LocalDateTime.now());

        referralRepo.save(referral);

        return referralMapper(referral);
    }





    public List<ReferralResponse> listMyReferrals(Integer employeeId) {

        return referralRepo.findByReferrerEmployeeId(employeeId)
                .stream()
                .map(this::referralMapper)
                .toList();
    }





    public List<ReferralResponse> listAllReferrals() {

        return referralRepo.findAll()
                .stream()
                .map(this::referralMapper)
                .toList();
    }




    @Transactional
    public void deactivateJob(Integer jobId) {

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        job.setIsActive(false);

        jobRepo.save(job);
    }





    private JobResponse jobMapper(Job job) {
        return new JobResponse(
                job.getJobId(),
                job.getTitle(),
                job.getDescription(),
                job.getJdFileUrl(),
                job.getIsActive()
        );
    }




    private ReferralResponse referralMapper(Referral referral) {
        return new ReferralResponse(
                referral.getReferralId(),
                referral.getJob().getJobId(),
                referral.getFriendName(),
                referral.getFriendEmail(),
                referral.getStatus(),
                referral.getCreatedAt()
        );
    }




    private void validateCV(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new ValidationException("CV file required");

        if (!file.getContentType().equals("application/pdf"))
            throw new ValidationException("Only PDF CV allowed");

        if (file.getSize() > 5_000_000)
            throw new ValidationException("File too large");
    }




    private void validate(ReferralStatus current, ReferralStatus next) {

        if (current == ReferralStatus.NEW && next == ReferralStatus.IN_REVIEW)
            return;

        if (current == ReferralStatus.IN_REVIEW &&
                (next == ReferralStatus.REVIEWED ||
                        next == ReferralStatus.REJECTED ||
                        next == ReferralStatus.HIRED))
            return;

        throw new ValidationException("Invalid status transition");
    }



}