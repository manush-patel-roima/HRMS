package com.company.hrms.social.controller;

import com.company.hrms.security.CustomUserDetails;
import com.company.hrms.social.dto.CreateCommentRequest;
import com.company.hrms.social.dto.CreateSocialPostRequest;
import com.company.hrms.social.dto.SocialCommentDto;
import com.company.hrms.social.dto.SocialPostDto;
import com.company.hrms.social.service.SocialService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    private final SocialService service;

    public SocialController(SocialService service){
        this.service = service;
    }

    @GetMapping("/feed")
    public List<SocialPostDto> feed(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Integer authorId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ){
        return service.feed(user.getEmployeeId(), page, size, authorId, tag, fromDate, toDate).getContent();
    }

    @PostMapping("/posts")
    public SocialPostDto createPost(@AuthenticationPrincipal CustomUserDetails user, @RequestBody CreateSocialPostRequest req){
        return service.createPost(req, user.getEmployeeId(), false);
    }

    @GetMapping("/posts/{id}")
    public SocialPostDto getPost(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id){
        return service.getPost(id, user.getEmployeeId());
    }

    @PostMapping("/posts/{id}/comments")
    public SocialCommentDto addComment(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id, @RequestBody CreateCommentRequest req){
        return service.addComment(id, req.getText(), user.getEmployeeId());
    }

    @PostMapping("/posts/{id}/like")
    public void likeToggle(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id){
        service.toggleLike(id, user.getEmployeeId());
    }

    @DeleteMapping("/posts/{id}")
    public void deletePost(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id){
        boolean isHr = user.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_HR"));
        service.deletePost(id, user.getEmployeeId(), isHr);
    }

    @PutMapping("/posts/{id}")
    public void editPost(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id, @RequestBody CreateSocialPostRequest req){
        service.editPost(id, req, user.getEmployeeId());
    }

    @PutMapping("/comments/{commentId}")
    public void editComment(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long commentId, @RequestBody CreateCommentRequest req){
        service.editComment(commentId, req.getText(), user.getEmployeeId());
    }

    @DeleteMapping("/comments/{commentId}")
    public void deleteComment(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long commentId){
        boolean isHr = user.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_HR"));
        service.deleteComment(commentId, user.getEmployeeId(), isHr);
    }

}
