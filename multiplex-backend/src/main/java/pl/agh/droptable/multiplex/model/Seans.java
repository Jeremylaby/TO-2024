package pl.agh.droptable.multiplex.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
public class Seans {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Timestamp start;
    private Timestamp end;
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Timestamp getStart() {
        return start;
    }

    public void setStart(Timestamp start) {
        this.start = start;
    }

    public Timestamp getEnd() {
        return end;
    }

    public void setEnd(Timestamp end) {
        this.end = end;
    }

    @Override
    public String toString() {
        return "Seans{" +
                "id=" + id +
                ", start=" + start +
                ", end=" + end +
                ", movie=" + movie +
                ", room=" + room +
                '}';
    }
}
