package com.company.hrms.games.controller;

import com.company.hrms.employee.entity.Employee;
import com.company.hrms.games.dto.*;
import com.company.hrms.games.service.GameService;
import com.company.hrms.security.CustomUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping("/upcoming-slots/{gameId}")
    public List<GameSlotResponse> getUpcomingSlots(
            @PathVariable Integer gameId) {

        return service.getUpcomingSlots(gameId);
    }

    @PostMapping("/book")
    public void bookSlot(
            @RequestBody BookingRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        Integer requesterId = user.getEmployeeId();

        
        List<Employee> participants =
                service.getEmployeesByIds(request.getParticipantIds());

        service.bookSlot(
                request.getSlotId(),
                requesterId,
                participants);
    }

    @GetMapping("/my-bookings")
    public List<MyBookingResponse> myBookings(
            @AuthenticationPrincipal CustomUserDetails user) {

        return service.getMyBookings(user.getEmployeeId());
    }

    @PostMapping("/cancel/{bookingGroupId}")
    public void cancel(@PathVariable Integer bookingGroupId) {
        service.cancelBooking(bookingGroupId);
    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/monitor")
    public List<SlotMonitorResponse> monitor() {
        return service.getUpcomingSlotsForMonitor();
    }


    @PreAuthorize("hasRole('HR')")
    @PostMapping("/config")
    public void saveConfig(
            @RequestBody GameConfigRequest request) {

        service.saveConfig(request);
    }


    @PreAuthorize("hasRole('HR')")
    @GetMapping("/config/{gameId}")
    public GameConfigResponse getConfig(
            @PathVariable Integer gameId) {

        return service.getConfig(gameId);
    }


    @PostMapping("/interest/{gameId}")
    public void toggleInterest(
            @PathVariable Integer gameId,
            @AuthenticationPrincipal CustomUserDetails user) {

        service.toggleInterest(user.getEmployeeId(), gameId);
    }


    @GetMapping("/games")
    public List<GameResponse> getGames(
            @AuthenticationPrincipal CustomUserDetails user) {

        return service.getGamesForEmployee(user.getEmployeeId());
    }



    @GetMapping("/{gameId}/interested-employees")
    public List<EmployeeSimpleResponse> getInterestedEmployees(
            @PathVariable Integer gameId,@AuthenticationPrincipal CustomUserDetails user) {

        return service.getInterestedEmployees(gameId, user.getEmployeeId());
    }


    @GetMapping("/slot/{slotId}")
    public GameSlotByIdResponse getSlotById(
            @PathVariable Integer slotId) {

        return service.getSlotById(slotId);
    }




}