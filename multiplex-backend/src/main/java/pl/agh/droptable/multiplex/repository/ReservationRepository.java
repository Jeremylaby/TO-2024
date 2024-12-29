package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.agh.droptable.multiplex.model.Reservation;

import java.sql.Timestamp;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.seans.start < :date")
    List<Reservation> findUnpaidReservationBefore(@Param("date")Timestamp date);
}
