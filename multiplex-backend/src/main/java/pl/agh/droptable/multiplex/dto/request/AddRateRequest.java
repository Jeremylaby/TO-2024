package pl.agh.droptable.multiplex.dto.request;

import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.model.User;

public class AddRateRequest {
    private int rate;
    private User user;
    private Movie movie;

    public int getRate() { return rate; }

    public void setRate(int rate) { this.rate = rate; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Movie getMovie() { return movie; }

    public void setMovie(Movie movie) { this.movie = movie; }
}
