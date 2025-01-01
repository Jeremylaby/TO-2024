package pl.agh.droptable.multiplex.controller;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import pl.agh.droptable.multiplex.dto.request.CreateMovieRequest;
import pl.agh.droptable.multiplex.dto.request.UpdateMovieRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.repository.GenreRepository;
import pl.agh.droptable.multiplex.repository.MovieRepository;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.service.MovieService;
import pl.agh.droptable.multiplex.service.SeansService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/movie")
public class MovieController {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public MovieController(MovieRepository movieRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    @PostMapping
    public Movie addMovie(@RequestBody CreateMovieRequest request) {
        var movie = request.toMovie(genreRepository);
        return movieRepository.saveAndFlush(movie);
    }

    @GetMapping("/:id")
    public Movie getMovie(@PathVariable long id) throws NotFoundException {
        return movieRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    @GetMapping
    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    @DeleteMapping("/:id")
    public void deleteMovie(@PathVariable long id) {
        movieRepository.deleteById(id);
    }

    @GetMapping("/seanses/{movieId}")
    public ResponseEntity<List<Seans>> getAllSeansForMovie(@PathVariable Long movieId) {
        List<Seans> seansList = seansService.getAllSeansForMovie(movieId);
        return ResponseEntity.ok(seansList);
    }

    @PutMapping
    public Movie updateMovie(@RequestBody UpdateMovieRequest request) throws NotFoundException {
        var movie = request.toMovie(genreRepository,movieRepository);
        return movieRepository.saveAndFlush(movie);
    }

}
