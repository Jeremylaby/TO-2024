package pl.agh.droptable.multiplex.dto.request;

import org.springframework.data.crossstore.ChangeSetPersister;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.repository.GenreRepository;
import pl.agh.droptable.multiplex.repository.MovieRepository;

import java.util.List;
import java.util.Optional;

public record UpdateMovieRequest(
        Long id,
        String title,
        String director,
        int duration,
        List<Long> genreIds
) {
    public Movie toMovie(GenreRepository genreRepository, MovieRepository movieRepository) throws ChangeSetPersister.NotFoundException {
        var movie = movieRepository.findById(id).orElseThrow(ChangeSetPersister.NotFoundException::new);
        movie.setTitle(title);
        movie.setDirector(director);
        movie.setDuration(duration);
        movie.setGenres(genreIds
                .stream()
                .map(genreRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList());
        return movie;
    }
}
