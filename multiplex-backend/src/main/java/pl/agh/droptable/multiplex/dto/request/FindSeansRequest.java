package pl.agh.droptable.multiplex.dto.request;

import java.sql.Timestamp;
import java.time.Instant;

public class FindSeansRequest {
    private String start;
    private String end;
    private Long roomId;
    private Long movieId;

    public Timestamp getStart() {
        return Timestamp.from(Instant.parse(start));
    }

    public void setStart(String start) {
        this.start = start;
    }

    public Timestamp getEnd() {
        return Timestamp.from(Instant.parse(end));
    }

    public void setEnd(String end) {
        this.end = end;
    }

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
}
