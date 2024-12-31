package pl.agh.droptable.multiplex.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.dto.SeatAdditionRequest;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.model.Seat;
import pl.agh.droptable.multiplex.repository.RoomRepository;
import pl.agh.droptable.multiplex.repository.SeatRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/seat")
public class SeatController {

    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;

    public SeatController(RoomRepository roomRepository, SeatRepository seatRepository) {
        this.roomRepository = roomRepository;
        this.seatRepository = seatRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSeatToRoom(@Valid @RequestBody SeatAdditionRequest request) {
        Optional<Room> optionalRoom = roomRepository.findByName(request.getRoomName());
        if (optionalRoom.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Room with provided name could not be found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        Room room = optionalRoom.get();

        Optional<Seat> optionalSeat = seatRepository.findByRowAndSeatNumberAndRoom(request.getRow(), request.getSeatNumber(), room);

        if (optionalSeat.isPresent()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Seat already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }

        Seat seat = new Seat();
        seat.setRow(request.getRow());
        seat.setSeatNumber(request.getSeatNumber());
        seat.setRoom(room);

        seatRepository.save(seat);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Seat added successfully!");

        return ResponseEntity.ok(response);
    }
}
