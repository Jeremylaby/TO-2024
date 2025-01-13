package pl.agh.droptable.multiplex.dto.request;

public class AddRateRequest {
    private int rate;
    private long userId;
    private long movieId;


    public int getRate() { return rate; }

    public void setRate(int rate) { this.rate = rate; }

    public long getUserId() { return userId; }

    public void setUserId(long userId) { this.userId = userId; }

    public long getMovieId() { return movieId; }

    public void setMovieId(long movieId) { this.movieId = movieId; }
}
