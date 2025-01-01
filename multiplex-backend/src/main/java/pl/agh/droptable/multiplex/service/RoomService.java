package pl.agh.droptable.multiplex.service;

import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.repository.RoomRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    public Optional<Room> getRoom(Long id) {
        return roomRepository.findById(id);
    }
    public List<Room> getAllRooms() {return roomRepository.findAll();}
    public Room saveRoom(Room room) {return roomRepository.saveAndFlush(room);}
    public void deleteRoom(Long id) {roomRepository.deleteById(id);}
}
