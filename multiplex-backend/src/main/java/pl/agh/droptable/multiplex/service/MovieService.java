package pl.agh.droptable.multiplex.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.repository.MovieRepository;

import java.util.HashMap;
import java.util.List;
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

    public List<HashMap<String, Object>> getNMostProfitableMovies(int n) {
        return this.movieRepository.getMostProfitableMovies(Pageable.ofSize(n)).get().map(pair-> {
            var r = new HashMap<String, Object>();
            r.put("movie", pair.getFirst());
            r.put("revenue", pair.getSecond());
            return r;
        }).toList();

    }
}
