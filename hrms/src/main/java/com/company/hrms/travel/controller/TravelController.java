package com.company.hrms.travel.controller;

import com.company.hrms.security.CustomUserDetails;
import com.company.hrms.travel.dto.CreateTravelRequest;
import com.company.hrms.travel.dto.TravelListResponse;
import com.company.hrms.travel.dto.TravelResponse;
import com.company.hrms.travel.entity.TravelDocument;
import com.company.hrms.travel.service.TravelService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/travels")
public class TravelController {

    private final TravelService travelService;

    public TravelController(TravelService travelService){

        this.travelService=travelService;
    }

    @PreAuthorize("hasRole('HR')")
    @PostMapping
    public TravelResponse createTravel(
            @RequestBody CreateTravelRequest request,
            @AuthenticationPrincipal CustomUserDetails user
            )
    {

        return travelService.createTravel(request,user.getEmployeeId());
    }


    @GetMapping
    public List<TravelListResponse> listTravels(
            @AuthenticationPrincipal CustomUserDetails user
    )
    {
        return travelService.listTravels(user.getEmployeeId());
    }


    @PostMapping("/documents/upload")
    public TravelDocument travelDocument(
            @RequestParam MultipartFile file,
            @RequestParam Integer travelId,

            @RequestParam String documentType,
            @AuthenticationPrincipal CustomUserDetails user
            )
    {



        return travelService.uploadDocument(file, travelId, documentType, user.getEmployeeId());
    }


    @PreAuthorize("hasAnyRole('HR','EMPLOYEE','MANAGER')")
    @GetMapping("/{travelId}/documents")
    public List<TravelDocument> getDocuments(
            @PathVariable Integer travelId,
            @AuthenticationPrincipal CustomUserDetails user
    )
    {
        return travelService.getTravelDocuments(travelId, user.getEmployeeId());
    }

}
