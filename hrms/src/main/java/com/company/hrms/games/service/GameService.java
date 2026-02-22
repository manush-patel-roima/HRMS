package com.company.hrms.games.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.ValidationException;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.games.dto.*;
import com.company.hrms.games.entity.*;
import com.company.hrms.games.repository.*;
import com.company.hrms.common.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class GameService {

    private final GameRepository gameRepo;
    private final GameSlotRepository slotRepo;
    private final GameSlotConfigRepository configRepo;
    private final BookingGroupRepository bookingGroupRepo;
    private final SlotParticipantRepository participantRepo;
    private final BookingQueueRepository queueRepo;
    private final PlayerGameStatsRepository statsRepo;
    private final EmployeeRepository employeeRepo;
    private final EmployeeGameInterestRepository interestRepo;
    private final EmailService emailService;

    public GameService(
            GameRepository gameRepo,
            GameSlotRepository slotRepo,
            GameSlotConfigRepository configRepo,
            BookingGroupRepository bookingGroupRepo,
            SlotParticipantRepository participantRepo,
            BookingQueueRepository queueRepo,
            PlayerGameStatsRepository statsRepo,
            EmployeeRepository employeeRepo,
            EmployeeGameInterestRepository interestRepo,
            EmailService emailService) {

        this.gameRepo = gameRepo;
        this.slotRepo = slotRepo;
        this.configRepo = configRepo;
        this.bookingGroupRepo = bookingGroupRepo;
        this.participantRepo = participantRepo;
        this.queueRepo = queueRepo;
        this.statsRepo = statsRepo;
        this.employeeRepo = employeeRepo;
        this.interestRepo = interestRepo;
        this.emailService = emailService;
    }


    @Transactional
    public void bookSlot(Integer slotId,
                         Integer requestedById,
                         List<Employee> participants) {

        GameSlot slot = slotRepo.findById(slotId).orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        Employee requestedBy = employeeRepo.findById(requestedById).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (slot.getStatus() == SlotStatus.CLOSED)
            throw new ValidationException("Slot closed");

        if (LocalDateTime.now()
                .isAfter(slot.getSlotDate().atTime(slot.getStartTime())))
            throw new ValidationException("Slot already started");

        GameSlotConfig config =
                configRepo.findByGame_GameId(
                        slot.getGame().getGameId()).orElseThrow(() -> new ResourceNotFoundException("Game config not found"));

        int totalPlayers = participants.size() + 1;

        if (totalPlayers < config.getMinPlayers() ||
                totalPlayers > config.getMaxPlayers())
            throw new ValidationException("Invalid participant count");

        PlayerGameStats stats =
                statsRepo.findByEmployee_EmployeeIdAndGame_GameIdAndPlayDate(
                                requestedBy.getEmployeeId(),
                                slot.getGame().getGameId(),
                                slot.getSlotDate())
                        .orElseGet(() -> {
                            PlayerGameStats s = new PlayerGameStats();
                            s.setEmployee(requestedBy);
                            s.setGame(slot.getGame());
                            s.setPlayDate(slot.getSlotDate());
                            s.setPlayedCount(0);
                            return statsRepo.save(s);
                        });

        boolean firstTimeToday = stats.getPlayedCount() == 0;

        BookingGroup group = new BookingGroup();
        group.setSlot(slot);
        group.setRequestedBy(requestedBy);
        group.setRequestedAt(LocalDateTime.now());

        if (firstTimeToday) {
            group.setBookingStatus(BookingStatus.BOOKED);
        } else {
            group.setBookingStatus(BookingStatus.PENDING);
        }

        bookingGroupRepo.save(group);

        List<SlotParticipant> all = new ArrayList<>();

        SlotParticipant requester = new SlotParticipant();
        requester.setBookingGroup(group);
        requester.setEmployee(requestedBy);
        all.add(requester);

        for (Employee e : participants) {
            SlotParticipant p = new SlotParticipant();
            p.setBookingGroup(group);
            p.setEmployee(e);
            all.add(p);
        }

        participantRepo.saveAll(all);

        if (!firstTimeToday) {
            BookingQueue queue = new BookingQueue();
            queue.setBookingGroup(group);
            queue.setAddedAt(LocalDateTime.now());
            queueRepo.save(queue);
        }

        sendGameBookingEmail(group);
    }



    @Transactional
    public void cancelBooking(Integer bookingGroupId) {

        BookingGroup group =
                bookingGroupRepo.findById(bookingGroupId).orElseThrow(() -> new ResourceNotFoundException("Booking group not found"));

        LocalDateTime slotStart =
                group.getSlot().getSlotDate()
                        .atTime(group.getSlot().getStartTime());

        if (LocalDateTime.now().isAfter(slotStart.minusHours(1)))
            throw new ValidationException(
                    "Cannot cancel within 1 hour of slot");

        group.setBookingStatus(BookingStatus.CANCELLED);
        bookingGroupRepo.save(group);
    }



    @Transactional
    public void processPendingAllocations() {

        List<GameSlot> allSlots = slotRepo.findAll();

        for (GameSlot slot : allSlots) {

            LocalDateTime slotStart =
                    slot.getSlotDate().atTime(slot.getStartTime());

            if (LocalDateTime.now()
                    .isAfter(slotStart.minusHours(1)) &&
                    slot.getStatus() == SlotStatus.OPEN) {

                List<BookingQueue> queue =
                        queueRepo.findByBookingGroup_Slot_SlotIdOrderByAddedAtAsc(
                                slot.getSlotId());

                if (!queue.isEmpty()) {

                    BookingGroup first =
                            queue.get(0).getBookingGroup();

                    first.setBookingStatus(BookingStatus.BOOKED);
                    bookingGroupRepo.save(first);

                    sendGameBookingEmail(first);
                }
            }
        }
    }



    @Transactional
    public void closeFinishedSlots() {

        List<GameSlot> slots = slotRepo.findAll();

        for (GameSlot slot : slots) {

            LocalDateTime slotEnd =
                    slot.getSlotDate().atTime(slot.getEndTime());

            if (LocalDateTime.now().isAfter(slotEnd) &&
                    slot.getStatus() == SlotStatus.OPEN) {

                slot.setStatus(SlotStatus.CLOSED);
                slotRepo.save(slot);

                List<BookingGroup> groups =
                        bookingGroupRepo.findBySlot_SlotIdAndBookingStatus(
                                slot.getSlotId(),
                                BookingStatus.BOOKED);

                for (BookingGroup g : groups) {

                    for (SlotParticipant p :
                            participantRepo.findByBookingGroup_BookingGroupId(
                                    g.getBookingGroupId())) {

                        PlayerGameStats stats =
                                statsRepo.findByEmployee_EmployeeIdAndGame_GameIdAndPlayDate(
                                                p.getEmployee().getEmployeeId(),
                                                slot.getGame().getGameId(),
                                                slot.getSlotDate())
                                        .orElseThrow(() -> new ResourceNotFoundException("Player stats not found"));

                        stats.setPlayedCount(
                                stats.getPlayedCount() + 1);

                        statsRepo.save(stats);
                    }
                }
            }
        }
    }




    public List<GameSlotResponse> getUpcomingSlots(Integer gameId) {

        LocalDate today = LocalDate.now();
        LocalTime nowTime = LocalTime.now();

        List<GameSlot> slots = slotRepo.findAll();




        return slots.stream()
                .filter(s -> s.getGame().getGameId().equals(gameId))
                .filter(s ->
                        s.getSlotDate().isAfter(today) ||
                                (s.getSlotDate().equals(today)
                                        && s.getStartTime().isAfter(nowTime)))
                .map(s -> new GameSlotResponse(
                        s.getSlotId(),
                        s.getGame().getGameName(),
                        s.getSlotDate(),
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getStatus()
                ))
                .toList();
    }




    public List<MyBookingResponse> getMyBookings(Integer employeeId) {

        List<BookingGroup> groups = bookingGroupRepo.findAll();

        List<MyBookingResponse> result = new ArrayList<>();

        for (BookingGroup group : groups) {

            List<SlotParticipant> participants =
                    participantRepo.findByBookingGroup_BookingGroupId(
                            group.getBookingGroupId());

            boolean isParticipant = participants.stream()
                    .anyMatch(p ->
                            p.getEmployee().getEmployeeId()
                                    .equals(employeeId));

            if (isParticipant) {

                List<String> names = participants.stream()
                        .map(p -> p.getEmployee().getFullName())
                        .toList();

                result.add(new MyBookingResponse(
                        group.getBookingGroupId(),
                        group.getSlot().getGame().getGameName(),
                        group.getSlot().getSlotDate(),
                        group.getSlot().getStartTime(),
                        group.getSlot().getEndTime(),
                        names,
                        group.getBookingStatus()
                ));
            }
        }

        return result;
    }





    public List<SlotMonitorResponse> getUpcomingSlotsForMonitor() {

        LocalDate today = LocalDate.now();
        LocalTime nowTime = LocalTime.now();

        List<GameSlot> slots = slotRepo.findAll();

        return slots.stream()
                .filter(s ->
                        s.getSlotDate().isAfter(today) ||
                                (s.getSlotDate().equals(today)
                                        && s.getStartTime().isAfter(nowTime)))
                .map(s -> {

                    List<BookingGroup> groups =
                            bookingGroupRepo
                                    .findBySlot_SlotIdAndBookingStatus(
                                            s.getSlotId(),
                                            BookingStatus.BOOKED);

                    List<String> names = new ArrayList<>();

                    for (BookingGroup g : groups) {
                        names.addAll(
                                participantRepo
                                        .findByBookingGroup_BookingGroupId(
                                                g.getBookingGroupId())
                                        .stream()
                                        .map(p -> p.getEmployee().getFullName())
                                        .toList()
                        );
                    }

                    return new SlotMonitorResponse(
                            s.getSlotId(),
                            s.getGame().getGameName(),
                            s.getSlotDate(),
                            s.getStartTime(),
                            s.getEndTime(),
                            s.getStatus(),
                            names
                    );
                })
                .toList();
    }



    @Transactional
    public void generateSlotsForTomorrow() {

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<GameSlotConfig> configs = configRepo.findAll();

        for (GameSlotConfig config : configs) {

            LocalTime start = LocalTime.parse(config.getStartHour());
            LocalTime end = LocalTime.parse(config.getEndHour());

            while (!start.plusMinutes(
                    config.getSlotDurationMinutes()).isAfter(end)) {

                GameSlot slot = new GameSlot();
                slot.setGame(config.getGame());
                slot.setSlotDate(tomorrow);
                slot.setStartTime(start);
                slot.setEndTime(
                        start.plusMinutes(config.getSlotDurationMinutes()));
                slot.setStatus(SlotStatus.OPEN);

                slotRepo.save(slot);

                start = start.plusMinutes(
                        config.getSlotDurationMinutes());
            }
        }
    }



    @Transactional
    public void saveConfig(GameConfigRequest request) {

        Game game = gameRepo.findById(request.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

        GameSlotConfig config = configRepo
                .findByGame_GameId(request.getGameId())
                .orElse(new GameSlotConfig());

        config.setGame(game);
        config.setSlotDurationMinutes(request.getSlotDurationMinutes());
        config.setMinPlayers(request.getMinPlayers());
        config.setMaxPlayers(request.getMaxPlayers());
        config.setStartHour(request.getStartHour());
        config.setEndHour(request.getEndHour());

        configRepo.save(config);
    }



    public GameConfigResponse getConfig(Integer gameId) {

        GameSlotConfig config = configRepo
                .findByGame_GameId(gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Config not found"));

        return new GameConfigResponse(
                gameId,
                config.getSlotDurationMinutes(),
                config.getMinPlayers(),
                config.getMaxPlayers(),
                config.getStartHour(),
                config.getEndHour()
        );
    }



    @Transactional
    public void toggleInterest(Integer employeeId, Integer gameId) {

        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(()->new ResourceNotFoundException("Employee not found"));

        Optional<EmployeeGameInterest> existing = interestRepo.findById(
                new EmployeeGameInterest.EmployeeGameInterestKey(employeeId, gameId)
        );

        if (existing.isPresent()) {

            interestRepo.delete(existing.get());

        } else {

            Game game = gameRepo.findById(gameId)
                    .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

            EmployeeGameInterest interest = new EmployeeGameInterest();

            interest.setId(
                    new EmployeeGameInterest.EmployeeGameInterestKey(
                            employeeId,
                            gameId
                    )
            );

            interest.setEmployee(employee);
            interest.setGame(game);

            interestRepo.save(interest);
        }
    }



    public List<Employee> getEmployeesByIds(List<Integer> ids) {

        return employeeRepo.findAllById(ids);
    }


    public List<GameResponse> getGamesForEmployee(Integer employeeId) {

        List<Game> games = gameRepo.findAll();
        List<GameResponse> result = new ArrayList<>();

        for (Game game : games) {

            boolean interested =
                    interestRepo.existsByEmployee_EmployeeIdAndGame_GameId(
                            employeeId,
                            game.getGameId());

            PlayerGameStats stats =
                    statsRepo.findByEmployee_EmployeeIdAndGame_GameIdAndPlayDate(
                                    employeeId,
                                    game.getGameId(),
                                    LocalDate.now())
                            .orElse(null);

            int played = stats != null ? stats.getPlayedCount() : 0;

            result.add(new GameResponse(
                    game.getGameId(),
                    game.getGameName(),
                    interested,
                    played
            ));
        }

        return result;
    }




    public List<EmployeeSimpleResponse> getInterestedEmployees(Integer gameId,Integer employeeId) {

        List<EmployeeGameInterest> interests =
                interestRepo.findByGame_GameId(gameId);

        return interests.stream()
                .filter(i -> !i.getEmployee().getEmployeeId().equals(employeeId))
                .map(i -> new EmployeeSimpleResponse(
                        i.getEmployee().getEmployeeId(),
                        i.getEmployee().getFullName()
                ))
                .toList();
    }



    public GameSlotByIdResponse getSlotById(Integer slotId) {

        GameSlot slot = slotRepo.findById(slotId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Slot not found"));

        GameSlotConfig config = configRepo
                .findByGame_GameId(slot.getGame().getGameId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Game config not found"));

        return new GameSlotByIdResponse(
                slot.getSlotId(),
                slot.getGame().getGameId(),
                slot.getGame().getGameName(),
                slot.getSlotDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getStatus(),
                config.getMinPlayers(),
                config.getMaxPlayers()
        );
    }



    private void sendGameBookingEmail(BookingGroup group) {

        List<SlotParticipant> participants =
                participantRepo.findByBookingGroup_BookingGroupId(
                        group.getBookingGroupId());

        List<String> emails = participants.stream()
                .map(p -> p.getEmployee().getEmail())
                .toList();

        List<String> names = participants.stream()
                .map(p -> p.getEmployee().getFullName())
                .toList();

        emailService.sendGameBookingEmail(
                emails,
                group.getSlot().getGame().getGameName(),
                group.getSlot().getSlotDate().toString(),
                group.getSlot().getStartTime().toString(),
                group.getSlot().getEndTime().toString(),
                group.getBookingStatus().name(),
                names
        );
    }



}
