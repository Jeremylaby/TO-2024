package pl.agh.droptable.multiplex.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.RoomDTO;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.service.RoomService;

import java.util.List;

@RestController
@RequestMapping("api/room")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody @Valid RoomDTO roomDTO) {
        var room = roomDTO.toRoom();
        room = roomService.saveRoom(room);
        return ResponseEntity.ok(room);
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
