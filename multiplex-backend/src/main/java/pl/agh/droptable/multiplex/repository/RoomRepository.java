package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
