package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Movie;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);

}
