package pl.agh.droptable.multiplex.service;

import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.repository.MovieRepository;

import java.util.Optional;

@Service
public class MovieService {
    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }
}
