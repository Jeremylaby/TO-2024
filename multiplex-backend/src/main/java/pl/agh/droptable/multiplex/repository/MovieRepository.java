package pl.agh.droptable.multiplex.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.util.Pair;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.agh.droptable.multiplex.model.Movie;

import java.math.BigDecimal;
import java.util.List;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);

    @Query(value = """
            SELECT new org.springframework.data.util.Pair(m, SUM(r.price))
            FROM Movie m
            JOIN Seans s ON s.movie = m
            JOIN Reservation r ON r.seans = s
            WHERE r.paid = true
            GROUP BY m
            ORDER BY SUM(r.price) DESC
            """,
            countQuery = """
            SELECT COUNT(DISTINCT m)
            FROM Movie m
            JOIN Seans s ON s.movie = m
            JOIN Reservation r ON r.seans = s
            WHERE r.paid = true
            """)
    Page<Pair<Movie, BigDecimal>> getMostProfitableMovies(Pageable pageable);
    @Query("""
                SELECT DISTINCT m FROM Movie m
                LEFT JOIN m.genres g
                WHERE (:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%')))
                AND (:director IS NULL OR LOWER(m.director) LIKE LOWER(CONCAT('%', :director, '%')))
                AND (:genreIds IS NULL OR g.id IN :genreIds)
                GROUP BY m
            """)
    Page<Movie> searchMovies(
            @Param("title") String title,
            @Param("director") String director,
            @Param("genreIds") List<Long> genreIds,
            Pageable pageable
    );

}
