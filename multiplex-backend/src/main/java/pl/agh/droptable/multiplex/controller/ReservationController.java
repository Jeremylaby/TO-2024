package pl.agh.droptable.multiplex.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.dto.AddReservationRequest;
import pl.agh.droptable.multiplex.model.Reservation;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.model.Seat;
import pl.agh.droptable.multiplex.model.User;
import pl.agh.droptable.multiplex.repository.SeatRepository;
import pl.agh.droptable.multiplex.repository.UserRepository;
import pl.agh.droptable.multiplex.service.ReservationService;
import pl.agh.droptable.multiplex.service.SeansService;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("api/reservation")
public class ReservationController {
    private final SeansService seansService;
    private final ReservationService reservationService;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

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
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "There is not such seans");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        if(userOptional.isEmpty()){
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "There is not such user");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        if(seatOptional.isEmpty()){
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "There is not such seat");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        Seans seans = seansOptional.get();
        User user = userOptional.get();
        Seat seat = seatOptional.get();
        if(!Objects.equals(seans.getRoom().getId(), seat.getRoom().getId())){
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "There is not such seat in seans room");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        Reservation reservation = new Reservation();
        reservation.setSeat(seat);
        reservation.setUser(user);
        reservation.setSeans(seans);
        reservation.setPrice(seans.getPrice());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Reservation added successfully!");
        return ResponseEntity.ok(response);
    }
}
