package com.company.hrms.social.mapper;

import com.company.hrms.social.dto.SocialCommentDto;
import com.company.hrms.social.dto.SocialPostDto;
import com.company.hrms.social.entity.SocialComment;
import com.company.hrms.social.entity.SocialPost;
import com.company.hrms.social.repository.SocialLikeRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SocialMapper {

    private final SocialLikeRepository likeRepository;

    public SocialMapper(SocialLikeRepository likeRepository){
        this.likeRepository = likeRepository;
    }

    public SocialPostDto toDto(SocialPost p, Integer currentEmployeeId){
        SocialPostDto dto = new SocialPostDto();
        dto.setId(p.getId());
        if(p.getAuthor()!=null){
            dto.setAuthorId(p.getAuthor().getEmployeeId());
            dto.setAuthorName(p.getAuthor().getFullName());
        }
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setTags(p.getTags());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setVisibility(p.getVisibility());
        dto.setIsSystemGenerated(p.getIsSystemGenerated());
        dto.setPostType(p.getPostType());
        dto.setRelatedEmployeeId(p.getRelatedEmployee()!=null? p.getRelatedEmployee().getEmployeeId() : null);

        int likeCount = (int) likeRepository.countByPost_Id(p.getId());
        dto.setLikeCount(likeCount);
        dto.setCommentCount(p.getComments()!=null? p.getComments().size():0);

        boolean liked = false;
        if(currentEmployeeId!=null){
            liked = likeRepository.existsByPost_IdAndEmployee_EmployeeId(p.getId(), currentEmployeeId);
        }
        dto.setLikedByCurrentUser(liked);

        List<SocialCommentDto> comments = (p.getComments()!=null? p.getComments().stream().map(this::toCommentDto).collect(Collectors.toList()) : List.of());

        dto.setComments(comments);

        return dto;
    }

    public SocialCommentDto toCommentDto(SocialComment c){
        Integer commenterId = null;
        String commenterName = null;
        if(c.getCommenter()!=null){
            commenterId = c.getCommenter().getEmployeeId();
            commenterName = c.getCommenter().getFullName();
        }
        return new SocialCommentDto(
                c.getId(),
                commenterId,
                commenterName,
                c.getText(),
                c.getCreatedAt()
        );
    }

}
