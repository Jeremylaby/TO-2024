package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Rate;

import java.util.List;

public interface RateRepository extends JpaRepository<Rate, Long> {
    List<Rate> findByMovieId(Long movieId);
}
