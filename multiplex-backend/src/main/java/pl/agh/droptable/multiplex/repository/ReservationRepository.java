package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.agh.droptable.multiplex.model.Reservation;
import pl.agh.droptable.multiplex.model.Seans;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.seans.start < :date")
    List<Reservation> findUnpaidReservationBefore(@Param("date")Timestamp date);
    @Query("SELECT r FROM Reservation r WHERE r.seans.id=:seansId AND r.seat.id = :seatId")
    Optional<Reservation> isSeatTaken(@Param("seansId")Long seansId, @Param("seatId")Long seatId);
    List<Reservation> findAllByUserId(Long userId);
    @Query("SELECT r FROM Reservation r WHERE r.seans.start>= :start AND r.seans.start<=:end")
    List<Reservation> findAllBetweenDates(@Param("start")Timestamp start, @Param("end")Timestamp end);
    int countBySeans(Seans seans);
}
