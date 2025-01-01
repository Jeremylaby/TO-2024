package pl.agh.droptable.multiplex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.droptable.multiplex.model.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long> {
}
