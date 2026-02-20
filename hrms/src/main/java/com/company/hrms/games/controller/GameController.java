//package com.company.hrms.games.controller;
//
//import com.company.hrms.games.dto.BookingResponse;
//import com.company.hrms.games.dto.GameSlotResponse;
//import com.company.hrms.games.service.GameService;
//import com.company.hrms.security.CustomUserDetails;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.stereotype.Service;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//
//
//@RestController
//@RequestMapping("/api/games")
//public class GameController {
//
//    private final GameService service;
//
//    public GameController(GameService service) {
//        this.service = service;
//    }
//
//    @PreAuthorize("hasRole('HR')")
//    @PostMapping("/generate")
//    public void generateSlots(
//            @RequestParam Integer gameId,
//            @RequestParam String date) {
//
//        service.generateSlots(gameId, LocalDate.parse(date));
//    }
//
//    @GetMapping("/slots")
//    public List<GameSlotResponse> getSlots(
//            @RequestParam Integer gameId,
//            @RequestParam String date) {
//
//        return service.getSlots(gameId, LocalDate.parse(date));
//    }
//
//    @PostMapping("/book/{slotId}")
//    public void bookSlot(
//            @PathVariable Integer slotId,
//            @AuthenticationPrincipal CustomUserDetails user) {
//
//        service.bookSlot(slotId, user.getEmployeeId());
//    }
//
//    @PostMapping("/cancel/{bookingId}")
//    public void cancel(
//            @PathVariable Integer bookingId,
//            @AuthenticationPrincipal CustomUserDetails user) {
//
//        service.cancelBooking(bookingId, user.getEmployeeId());
//    }
//
//    @GetMapping("/my-bookings")
//    public List<BookingResponse> myBookings(
//            @AuthenticationPrincipal CustomUserDetails user) {
//
//        return service.getMyBookings(user.getEmployeeId());
//    }
//}