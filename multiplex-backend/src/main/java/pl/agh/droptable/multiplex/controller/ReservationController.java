package pl.agh.droptable.multiplex.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.AddReservationRequest;
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
    private final static Long FIXED_RATE = 900000L;

    public ReservationController(SeansService seansService, ReservationService reservationService, SeatRepository seatRepository, UserRepository userRepository) {
        this.seansService = seansService;
        this.reservationService = reservationService;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReservation(@Valid @RequestBody AddReservationRequest request) {
        Optional<Seans> seansOptional = seansService.getSeansById(request.getSeansId());
        Optional<User> userOptional = userRepository.findById(request.getUserId());
        Optional<Seat> seatOptional = seatRepository.findById(request.getSeatId());
        if(seansOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such seans"));
        }
        if(userOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such user"));
        }
        if(seatOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such seat"));
        }
        Seans seans = seansOptional.get();
        User user = userOptional.get();
        Seat seat = seatOptional.get();
        if(!Objects.equals(seans.getRoom().getId(), seat.getRoom().getId())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such seat in seans room"));
        }
        Reservation reservation = new Reservation();
        reservation.setSeat(seat);
        reservation.setUser(user);
        reservation.setSeans(seans);
        reservation.setPaid(false);
        reservation.setPrice(seans.getPrice());
        reservationService.addReservation(reservation);
        return ResponseEntity.ok(Map.of("message", "Reservation added successfully!"));
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
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        Optional<Reservation> optionalReservation = reservationService.getReservation(id);
        if(optionalReservation.isEmpty()){;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such reservation"));
        }
        Reservation reservation = optionalReservation.get();
        reservationService.removeReservation(reservation);
        return ResponseEntity.ok(Map.of("message", "Reservation deleted successfully!"));
    }
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payReservation(@PathVariable Long id) {
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
