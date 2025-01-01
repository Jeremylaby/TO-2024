package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.agh.droptable.multiplex.model.Seans;

import java.sql.Timestamp;
import java.util.List;

public interface SeansRepository extends JpaRepository<Seans, Long> {
    @Query("SELECT s FROM Seans s WHERE s.room.id = :roomId AND (s.endTime BETWEEN :start AND :end OR s.start BETWEEN :start AND :end) ORDER BY s.movie.id")
    List<Seans> findSeansByRoomAndDateRange(
            @Param("roomId") long roomId,
            @Param("start") Timestamp start,
            @Param("end") Timestamp end
    );
    List<Seans>findAllByStartBetween(Timestamp start, Timestamp end);
    List<Seans> findAllByStartBetweenAndRoomIdOrderByMovieId(Timestamp start, Timestamp end, Long roomId);
    List<Seans> findAllByStartBetweenAndMovie_IdOrderByRoomId(Timestamp start, Timestamp end, Long movieId);
    List<Seans> findByStartAfter(Timestamp start);
    List<Seans> findAllByMovieId(Long movieId);
}


