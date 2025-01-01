package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
