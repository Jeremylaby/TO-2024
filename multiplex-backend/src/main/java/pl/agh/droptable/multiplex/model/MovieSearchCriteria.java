package pl.agh.droptable.multiplex.model;

import java.util.List;

public class MovieSearchCriteria {
    private String title;
    private String director;
    private List<Long> genreIds;

    public MovieSearchCriteria(String title, String director, List<Long> genreIds) {
        this.title = title;
        this.director = director;
        this.genreIds = genreIds;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public List<Long> getGenreIds() {
        return genreIds;
    }

    public void setGenreIds(List<Long> genreIds) {
        this.genreIds = genreIds;
    }
}
