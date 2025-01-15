package pl.agh.droptable.multiplex.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.ReservationDTO;
import pl.agh.droptable.multiplex.dto.request.AddReservationRequest;
import pl.agh.droptable.multiplex.dto.ReservationTimeRange;
import pl.agh.droptable.multiplex.model.Reservation;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.model.Seat;
import pl.agh.droptable.multiplex.model.User;
import pl.agh.droptable.multiplex.repository.SeatRepository;
import pl.agh.droptable.multiplex.repository.UserRepository;
import pl.agh.droptable.multiplex.service.ReservationService;
import pl.agh.droptable.multiplex.service.SeansService;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("api/reservation")
public class ReservationController {
    private final SeansService seansService;
    private final ReservationService reservationService;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private static final long FIXED_RATE = 900000L;

    public ReservationController(SeansService seansService, ReservationService reservationService, SeatRepository seatRepository, UserRepository userRepository) {
        this.seansService = seansService;
        this.reservationService = reservationService;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }
    @Transactional
    @PostMapping("/add")
    public ResponseEntity<?> addReservation(@Valid @RequestBody AddReservationRequest request) {
        Optional<Seans> seansOptional = seansService.getSeansById(request.getSeansId());
        Optional<User> userOptional = userRepository.findById(request.getUserId());
        List<Long> seatIds = request.getSeats();
        if(seansOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such seans"));
        }
        if(userOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such user"));
        }   

        Seans seans = seansOptional.get();
        User user = userOptional.get();
        List<Seat> seats = seatRepository.findAllById(seatIds);
        if(seats.size()!=seatIds.size()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Some seats are missing"));
        }
        List<Reservation> reservations = new ArrayList<>();
        for( Seat seat : seats) {

            if (!Objects.equals(seans.getRoom().getId(), seat.getRoom().getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "There is not such seat: "+ seat +" in seans room: "+seans.getRoom().getId()));
            }
            if(reservationService.isSeatTaken(seans.getId(),seat.getId())){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Seat already taken "+seat));
            }
            Reservation reservation = new Reservation();
            reservation.setSeat(seat);
            reservation.setUser(user);
            reservation.setSeans(seans);
            reservation.setPaid(false);
            reservation.setPrice(seans.getPrice());
            reservations.add(reservation);
        }

        reservationService.addReservations(reservations);
        List<Long> reservationIds = reservations.stream()
                .map(Reservation::getId)
                .toList();

        return ResponseEntity.ok(Map.of(
                "message", "Reservations added successfully!",
                "reservationIds", reservationIds
        ));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable("id") Long id) {
        Optional<Reservation> optionalReservation = reservationService.getReservation(id);
        if(optionalReservation.isEmpty()){;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such reservation"));
        }
        Reservation reservation = optionalReservation.get();
        return ResponseEntity.ok(reservation);
    }
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteReservation(@PathVariable("id") Long id) {
        Optional<Reservation> optionalReservation = reservationService.getReservation(id);
        if(optionalReservation.isEmpty()){;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such reservation"));
        }
        Reservation reservation = optionalReservation.get();
        reservationService.removeReservation(reservation);
        return ResponseEntity.ok(Map.of("message", "Reservation deleted successfully!"));
    }
    @DeleteMapping("/{reservationId}/user/{userId}/cancel")
    public ResponseEntity<?> deleteReservation(
            @PathVariable("reservationId") Long reservationId,
            @PathVariable("userId") Long userId) {

        Optional<Reservation> optionalReservation = reservationService.getReservation(reservationId);
        if (optionalReservation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Reservation not found"));
        }

        Reservation reservation = optionalReservation.get();

        if (reservation.getUser().getId()!=userId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not the owner of this reservation"));
        }

        if (reservation.getSeans().getStart().toLocalDateTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Cannot delete past reservations"));
        }

        reservationService.removeReservation(reservation);

        return ResponseEntity.ok(Map.of("message", "Reservation deleted successfully"));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payReservation(@PathVariable("id") Long id) {
        Optional<Reservation> optionalReservation = reservationService.getReservation(id);
        if(optionalReservation.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such reservation"));
        }
        Reservation reservation = optionalReservation.get();
        if(reservation.isPaid()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Reservation already paid"));
        }
        reservation.setPaid(true);
        reservationService.addReservation(reservation);
        return ResponseEntity.ok(Map.of("message", "Reservation paid successfully!"));

    }
    @GetMapping("/user/{id}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUserId(@PathVariable("id") Long id) {
        List<Reservation> reservations = reservationService.findReservationsByUserId(id);
        List<ReservationDTO> dtoList = reservations.stream()
                .map(ReservationDTO::new)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        List<Reservation> reservations = reservationService.getReservations();
        List<ReservationDTO> dtoList = reservations.stream()
                .map(ReservationDTO::new)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/all/today")
    public ResponseEntity<List<ReservationDTO>> getAllReservationsToday() {
        LocalDateTime today = LocalDateTime.now();
        Timestamp start = Timestamp.valueOf(today.withHour(0).withMinute(0).withSecond(0));
        Timestamp end = Timestamp.valueOf(today.withHour(23).withMinute(59).withSecond(59));
        List<Reservation> reservations = reservationService.findReservationsBetweenDates(start, end);
        List<ReservationDTO> dtoList = reservations.stream()
                .map(ReservationDTO::new)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/all/time-range")
    public ResponseEntity<List<ReservationDTO>> getAllReservationsTimeRange(@Valid @RequestBody ReservationTimeRange request) {
        Timestamp start = request.getStart();
        Timestamp end = request.getEnd();
        List<Reservation> reservations = reservationService.findReservationsBetweenDates(start, end);
        List<ReservationDTO> dtoList = reservations.stream()
                .map(ReservationDTO::new)
                .toList();
        return ResponseEntity.ok(dtoList);
    }
    //15 minutes
    @Scheduled(fixedRate = FIXED_RATE)
    public void removeUnpaidReservations() {
        Timestamp time = Timestamp.valueOf(LocalDateTime.now().plusHours(1));
        List<Reservation> reservations = reservationService.getUnpaidReservationsBefore(time);
        for(Reservation reservation : reservations){
            reservationService.removeReservation(reservation);
        }
    }
}
