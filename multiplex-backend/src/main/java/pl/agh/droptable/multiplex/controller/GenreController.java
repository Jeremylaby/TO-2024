package pl.agh.droptable.multiplex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.model.Genre;
import pl.agh.droptable.multiplex.repository.GenreRepository;

import java.util.List;

@RestController
@RequestMapping("/api/genre")
public class GenreController {
    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }
    @GetMapping
    public ResponseEntity<List<Genre>> findAll() {
        List<Genre> genres = genreRepository.findAll();
        return ResponseEntity.ok(genres);
    }
}
