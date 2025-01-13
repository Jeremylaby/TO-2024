package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.agh.droptable.multiplex.model.Rate;

import java.util.List;

public interface RateRepository extends JpaRepository<Rate, Long> {

    List<Rate> findByMovieId(Long movieId);

    @Query("SELECT AVG(r.rate) FROM Rate r WHERE r.movie.id = :movieId")
    Double findAverageByMovieId(Long movieId);

    @Query("SELECT r FROM Rate r WHERE r.user.id = :userId")
    List<Rate> findByUserId(Long userId);
}

   