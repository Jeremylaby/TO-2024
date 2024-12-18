package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
