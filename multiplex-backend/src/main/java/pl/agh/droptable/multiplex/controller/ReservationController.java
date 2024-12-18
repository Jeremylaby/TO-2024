package pl.agh.droptable.multiplex.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.dto.AddReservationRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/reservations")
public class ReservationController {
    @PostMapping("/add")
    public ResponseEntity<?> addReservation(@Valid @RequestBody AddReservationRequest addReservationRequest) {

        Map<String, String> response = new HashMap<>();
        response.put("message", "Reservation added successfully!");
        return ResponseEntity.ok(response);
    }
}
