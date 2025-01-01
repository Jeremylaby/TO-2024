package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {
}
