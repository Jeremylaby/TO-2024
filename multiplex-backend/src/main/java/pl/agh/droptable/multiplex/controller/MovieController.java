package pl.agh.droptable.multiplex.controller;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.request.CreateMovieRequest;
import pl.agh.droptable.multiplex.dto.request.GetRecommendationRequest;
import pl.agh.droptable.multiplex.dto.request.UpdateMovieRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.repository.GenreRepository;
import pl.agh.droptable.multiplex.repository.MovieRepository;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.service.MovieRecommendationService;
import pl.agh.droptable.multiplex.service.SeansService;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/movie")
public class MovieController {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final SeansService seansService;
    private final MovieRecommendationService movieRecommendationService;

    public MovieController(MovieRepository movieRepository, GenreRepository genreRepository, SeansService seansService, MovieRecommendationService movieRecommendationService) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.seansService = seansService;
        this.movieRecommendationService = movieRecommendationService;
    }

    @PostMapping
    public Movie addMovie(@RequestBody CreateMovieRequest request) {
        var movie = request.toMovie(genreRepository);
        return movieRepository.saveAndFlush(movie);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable long id) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "There is no such movie"));
        }
        return ResponseEntity.ok(optionalMovie.get());
    }
    @GetMapping
    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    @DeleteMapping("/:id")
    public void deleteMovie(@PathVariable long id) {
        movieRepository.deleteById(id);
    }

    @GetMapping("/seanses/{id}")
    public ResponseEntity<List<Seans>> getAllSeansForMovie(@PathVariable long id) {
        List<Seans> seansList = seansService.getAllSeansForMovie(id);
        return ResponseEntity.ok(seansList);
    }

    @PutMapping
    public Movie updateMovie(@RequestBody UpdateMovieRequest request) throws NotFoundException {
        var movie = request.toMovie(genreRepository,movieRepository);
        return movieRepository.saveAndFlush(movie);
    }

    @PostMapping("/recommendations/rating")
    public ResponseEntity<?> getMovieRecommendationsByRating(@RequestBody GetRecommendationRequest request) {
        Timestamp startTimestamp = request.getStartTimestamp();
        Timestamp endTimestamp = request.getEndTimestamp();

        if (startTimestamp == null || endTimestamp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "startTimestamp and endTimestamp cannot be null"));
        }

        List<Movie> recommendedMovies = movieRecommendationService.recommendMoviesByRating(startTimestamp, endTimestamp);
        return ResponseEntity.ok(recommendedMovies);
    }

    @PostMapping("/recommendations/sales")
    public ResponseEntity<?> getMovieRecommendationsBySales(@RequestBody GetRecommendationRequest request) {
        Timestamp startTimestamp = request.getStartTimestamp();
        Timestamp endTimestamp = request.getEndTimestamp();

        if (startTimestamp == null || endTimestamp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "startTimestamp and endTimestamp cannot be null"));
        }

        List<Movie> recommendedMovies = movieRecommendationService.recommendMoviesBySales(startTimestamp, endTimestamp);
        return ResponseEntity.ok(recommendedMovies);
    }
}
