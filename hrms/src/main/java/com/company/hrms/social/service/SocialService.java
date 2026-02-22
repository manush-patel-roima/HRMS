package com.company.hrms.social.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.ForbiddenException;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.notification.NotificationService;
import com.company.hrms.social.dto.CreateSocialPostRequest;
import com.company.hrms.social.dto.SocialCommentDto;
import com.company.hrms.social.dto.SocialPostDto;
import com.company.hrms.social.entity.SocialComment;
import com.company.hrms.social.entity.SocialLike;
import com.company.hrms.social.entity.SocialPost;
import com.company.hrms.social.mapper.SocialMapper;
import com.company.hrms.social.repository.SocialCommentRepository;
import com.company.hrms.social.repository.SocialLikeRepository;
import com.company.hrms.social.repository.SocialPostRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SocialService {

    private final SocialPostRepository postRepo;
    private final SocialCommentRepository commentRepo;
    private final SocialLikeRepository likeRepo;
    private final EmployeeRepository employeeRepo;
    private final NotificationService notificationService;
    private final SocialMapper mapper;
    private final com.company.hrms.common.service.EmailService emailService;

    public SocialService(SocialPostRepository postRepo,
                         SocialCommentRepository commentRepo,
                         SocialLikeRepository likeRepo,
                         EmployeeRepository employeeRepo,
                         NotificationService notificationService,
                         SocialMapper mapper,
                         com.company.hrms.common.service.EmailService emailService){
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
        this.likeRepo = likeRepo;
        this.employeeRepo = employeeRepo;
        this.notificationService = notificationService;
        this.mapper = mapper;
        this.emailService = emailService;
    }

    @Transactional
    public SocialPostDto createPost(CreateSocialPostRequest req, Integer authorId, boolean systemGenerated){
        Employee author = employeeRepo.findById(authorId)
                .orElseThrow(()-> new ResourceNotFoundException("Author not found"));

        SocialPost p = new SocialPost();
        p.setAuthor(author);
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setTags(req.getTags());
        p.setCreatedAt(LocalDateTime.now());
        p.setVisibility("ALL");
        p.setIsSystemGenerated(systemGenerated);
        p.setPostType(req.getPostType());

        if(req.getRelatedEmployeeId()!=null){
            Employee related = employeeRepo.findById(req.getRelatedEmployeeId())
                    .orElseThrow(()-> new ResourceNotFoundException("Related employee not found"));
            p.setRelatedEmployee(related);
            if(systemGenerated){
                p.setSystemPostDate(LocalDate.now());
            }
        }

        // prevent duplicate system posts: check existing
        if(systemGenerated && req.getRelatedEmployeeId()!=null && req.getPostType()!=null){
            Optional<SocialPost> existing = postRepo.findSystemPostByTypeAndRelatedEmployeeAndDate(
                    req.getPostType(), req.getRelatedEmployeeId(), LocalDate.now());
            if(existing.isPresent()){
                return mapper.toDto(existing.get(), authorId);
            }
        }

        SocialPost saved;
        try{
            saved = postRepo.save(p);
        }catch(DataIntegrityViolationException ex){
            // likely duplicate system post due to race
            Optional<SocialPost> existing = postRepo.findSystemPostByTypeAndRelatedEmployeeAndDate(
                    req.getPostType(), req.getRelatedEmployeeId(), LocalDate.now());
            if(existing.isPresent()){
                return mapper.toDto(existing.get(), authorId);
            }
            throw ex;
        }

        // send notification to related employee if present and not system-generated (or even if system-generated)
        if(saved.getRelatedEmployee()!=null){
            String message = (systemGenerated ? "Celebration: " : "") + saved.getTitle();
            try{
                notificationService.createNotification(saved.getRelatedEmployee().getEmployeeId(), message, "social_post:"+saved.getId(), "/social");
            }catch(Exception ex){
                // logging
            }
        }

        return mapper.toDto(saved, authorId);
    }

    public Page<SocialPostDto> feed(Integer currentEmployeeId, int page, int size, Integer authorFilter, String tagFilter, LocalDate fromDate, LocalDate toDate){
        PageRequest pr = PageRequest.of(page,size);
        Page<SocialPost> posts;

        if(authorFilter!=null){
            posts = postRepo.findByAuthor_EmployeeIdOrderByCreatedAtDesc(authorFilter, pr);
        } else {
            posts = postRepo.findAllByOrderByCreatedAtDesc(pr);
        }

        // filter in-memory for tags and date range to keep repository simple
        Page<SocialPostDto> dtoPage = posts.map(p -> mapper.toDto(p, currentEmployeeId));

        if(tagFilter==null && fromDate==null && toDate==null){
            return dtoPage;
        }

        List<SocialPostDto> filtered = dtoPage.stream()
                .filter(p->{
                    boolean ok = true;
                    if(tagFilter!=null && p.getTags()!=null){
                        ok = p.getTags().contains(tagFilter);
                    }
                    if(ok && fromDate!=null){
                        ok = !p.getCreatedAt().toLocalDate().isBefore(fromDate);
                    }
                    if(ok && toDate!=null){
                        ok = !p.getCreatedAt().toLocalDate().isAfter(toDate);
                    }
                    return ok;
                })
                .collect(Collectors.toList());

        // convert back to a Page by using existing metadata - simple approach: return a PageImpl
        return new org.springframework.data.domain.PageImpl<>(filtered, pr, filtered.size());
    }

    public SocialPostDto getPost(Long postId, Integer currentEmployeeId){
        SocialPost p = postRepo.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post not found"));
        return mapper.toDto(p, currentEmployeeId);
    }

    @Transactional
    public SocialCommentDto addComment(Long postId, String text, Integer commenterId){
        SocialPost p = postRepo.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post not found"));
        Employee commenter = employeeRepo.findById(commenterId).orElseThrow(()-> new ResourceNotFoundException("Employee not found"));

        SocialComment c = new SocialComment();
        c.setPost(p);
        c.setCommenter(commenter);
        c.setText(text);

        SocialComment saved = commentRepo.save(c);

        // notify post author
        if(p.getAuthor()!=null && !p.getAuthor().getEmployeeId().equals(commenterId)){
            try{
                notificationService.createNotification(p.getAuthor().getEmployeeId(), commenter.getFullName()+" commented on your post", "social_post:"+p.getId(), "/social");
            }catch(Exception ex){ }
        }

        return mapper.toCommentDto(saved);
    }

    @Transactional
    public void editComment(Long commentId, String text, Integer requesterId){
        SocialComment c = commentRepo.findById(commentId).orElseThrow(()-> new ResourceNotFoundException("Comment not found"));
        if(!c.getCommenter().getEmployeeId().equals(requesterId)){
            throw new ForbiddenException("Unauthorized");
        }
        c.setText(text);
        commentRepo.save(c);
    }

    @Transactional
    public void deleteComment(Long commentId, Integer requesterId, boolean isHr){
        SocialComment c = commentRepo.findById(commentId).orElseThrow(()-> new ResourceNotFoundException("Comment not found"));
        if(!c.getCommenter().getEmployeeId().equals(requesterId) && !isHr){
            throw new ForbiddenException("Unauthorized");
        }
        commentRepo.delete(c);

        if(isHr && !c.getCommenter().getEmployeeId().equals(requesterId)){
            // send warning email
            try{
                String to = c.getCommenter().getEmail();
                emailService.sendWarningEmail(to, "Inappropriate comment removed", "Your comment was removed by HR for violating guidelines.");
            }catch(Exception ex){ }
        }
    }

    @Transactional
    public void deletePost(Long postId, Integer requesterId, boolean isHr){
        SocialPost p = postRepo.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post not found"));
        if(!p.getAuthor().getEmployeeId().equals(requesterId) && !isHr){
            throw new ForbiddenException("Unauthorized");
        }
        postRepo.delete(p);

        if(isHr && !p.getAuthor().getEmployeeId().equals(requesterId)){
            // send warning email to author
            try{
                emailService.sendWarningEmail(p.getAuthor().getEmail(), "Post removed by HR", "Your post titled '"+p.getTitle()+"' was removed by HR for violating guidelines.");
            }catch(Exception ex){ }
        }
    }

    @Transactional
    public void editPost(Long postId, CreateSocialPostRequest req, Integer requesterId){
        SocialPost p = postRepo.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post not found"));
        if(!p.getAuthor().getEmployeeId().equals(requesterId)){
            throw new ForbiddenException("Unauthorized");
        }
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setTags(req.getTags());
        postRepo.save(p);
    }

    @Transactional
    public boolean toggleLike(Long postId, Integer employeeId){
        SocialPost p = postRepo.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post not found"));
        boolean exists = likeRepo.existsByPost_IdAndEmployee_EmployeeId(postId, employeeId);
        if(exists){
            likeRepo.deleteByPost_IdAndEmployee_EmployeeId(postId, employeeId);
            return false;
        }else{
            SocialLike l = new SocialLike();
            l.setPost(p);
            Employee e = employeeRepo.findById(employeeId).orElseThrow(()-> new ResourceNotFoundException("Employee not found"));
            l.setEmployee(e);
            try{
                likeRepo.save(l);
            }catch(DataIntegrityViolationException ex){
                // duplicate like attempted concurrently
                return true;
            }
            return true;
        }
    }

    // scheduled job: create birthday and anniversary posts
    @Transactional
    public void generateDailyCelebrationPosts(){
        List<Employee> employees = employeeRepo.findAll();
        LocalDate today = LocalDate.now();

        for(Employee e: employees){
            if(e.getDateOfBirth()!=null){
                if(e.getDateOfBirth().getMonth()== today.getMonth() && e.getDateOfBirth().getDayOfMonth()==today.getDayOfMonth()){
                    CreateSocialPostRequest req = new CreateSocialPostRequest();
                    req.setTitle("Happy Birthday " + e.getFullName());
                    req.setDescription("Today is " + e.getFullName() + "'s birthday. Wish them! ");
                    req.setPostType("BIRTHDAY");
                    req.setRelatedEmployeeId(e.getEmployeeId());
                    createPost(req, getSystemUserId(), true);
                }
            }

            if(e.getDateOfJoining()!=null){
                LocalDate doj = e.getDateOfJoining();
                int years = Period.between(doj, today).getYears();
                if(years>0 && doj.getMonth()== today.getMonth() && doj.getDayOfMonth()== today.getDayOfMonth()){
                    CreateSocialPostRequest req = new CreateSocialPostRequest();
                    req.setTitle(e.getFullName() + " completes " + years + " years at the organization");
                    req.setDescription(e.getFullName() + " has completed " + years + " years with us. Congratulate them!");
                    req.setPostType("ANNIVERSARY");
                    req.setRelatedEmployeeId(e.getEmployeeId());
                    createPost(req, getSystemUserId(), true);
                }
            }
        }
    }

    // helper: system user id - use HR admin or a virtual system account if available - fallback to first HR
    private Integer getSystemUserId(){
        // try to find HR user
        Optional<Employee> hr = employeeRepo.findAll()
                .stream()
                .filter(x-> x.getRole()!=null && "HR".equals(x.getRole().getRoleName()))
                .findFirst();
        return hr.map(Employee::getEmployeeId).orElseGet(() -> employeeRepo.findAll().stream().findFirst().map(Employee::getEmployeeId).orElse(1));
    }

}

