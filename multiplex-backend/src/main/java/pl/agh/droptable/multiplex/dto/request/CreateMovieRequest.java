package pl.agh.droptable.multiplex.dto.request;

import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.repository.GenreRepository;

import java.util.List;
import java.util.Optional;

public record CreateMovieRequest(
        String title,
        String director,
        int duration,
        String imageUrl,
        List<Long> genreIds
) {
    public Movie toMovie(GenreRepository genreRepository) {
        var movie = new Movie();
        movie.setTitle(title);
        movie.setDirector(director);
        movie.setDuration(duration);
        movie.setImageUrl(imageUrl);
        movie.setGenres(genreIds
                .stream()
                .map(genreRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList());
        return movie;
    }
}
