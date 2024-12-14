package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.agh.droptable.multiplex.model.Seans;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface SeansRepository extends JpaRepository<Seans, Long> {
    @Query("SELECT s FROM Seans s WHERE s.room.id = :roomId AND (s.end BETWEEN :start AND :end OR s.start BETWEEN :start AND :end)")
    List<Seans> findSeansByRoomAndDateRange(
            @Param("roomId") long roomId,
            @Param("start") Timestamp start,
            @Param("end") Timestamp end
    );

}


