package pl.agh.droptable.multiplex.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class AddSeansRequest {
    @NotNull(message = "Movie ID cannot be null")
    private Long movieId;

    @NotNull(message = "Room ID cannot be null")
    private Long roomId;

    @NotNull(message = "Start time cannot be null")
    private Timestamp start;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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

    public Timestamp getStart() {
        return start;
    }

    public void setStart(Timestamp start) {
        this.start = start;
    }
}
