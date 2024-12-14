package pl.agh.droptable.multiplex.dto;

import java.sql.Timestamp;

public class AddSeansRequest {
    private Long roomId;
    private Long movieId;
    private Timestamp start;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Timestamp getStart() {
        return start;
    }

    public void setStart(Timestamp start) {
        this.start = start;
    }
}
