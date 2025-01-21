package pl.agh.droptable.multiplex.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.RoomDTO;
import pl.agh.droptable.multiplex.dto.request.RoomCreationRequest;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.model.Seat;
import pl.agh.droptable.multiplex.repository.SeatRepository;
import pl.agh.droptable.multiplex.service.RoomService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/room")
public class RoomController {
    private final RoomService roomService;
    private final SeatRepository seatRepository;

    public RoomController(RoomService roomService, SeatRepository seatRepository) {
        this.roomService = roomService;
        this.seatRepository = seatRepository;
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody @Valid RoomDTO roomDTO) {
        var room = roomDTO.toRoom();
        room = roomService.saveRoom(room);
        return ResponseEntity.ok(room);
    }
    @Transactional
    @PostMapping("/create")
    public ResponseEntity<?> createRoomWithSeats(@Valid @RequestBody RoomCreationRequest request) {
        Optional<Room> optionalRoom = roomService.findByName(request.getRoomName());
        if (optionalRoom.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Room with this name already exists."));
        }

        Room room = new Room();
        room.setName(request.getRoomName());
        room.setCapacity(request.getSeats().size());

        room = roomService.saveRoom(room);

        List<Seat> seatsToSave = new ArrayList<>();
        for (Seat seatRequest : request.getSeats()) {
            Seat seat = new Seat();
            seat.setRow(seatRequest.getRow());
            seat.setSeatNumber(seatRequest.getSeatNumber());
            seat.setRoom(room);
            seatsToSave.add(seat);
        }
        seatRepository.saveAll(seatsToSave);

        return ResponseEntity.ok(Map.of(
                "message", "Room and seats created successfully!",
                "roomId", room.getId(),
                "seats", seatsToSave
        ));
    }

    @GetMapping("/:id")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {

        var room = roomService.getRoom(id);
        if (room.isPresent()) return ResponseEntity.ok(room.get());
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PutMapping
    public ResponseEntity<Room> updateRoom(@RequestBody @Valid RoomDTO roomDTO) {
        if (roomDTO.id() == null) return ResponseEntity.badRequest().build();
        var room = roomDTO.toRoom();
        room = roomService.saveRoom(room);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/:id")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }

}
