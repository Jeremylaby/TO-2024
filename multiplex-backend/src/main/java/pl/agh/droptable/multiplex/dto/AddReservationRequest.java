package pl.agh.droptable.multiplex.dto;

import java.util.List;

public class AddReservationRequest {
    private Long userId;
    private Long seansId;
    private List<Long> seats;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSeansId() {
        return seansId;
    }

    public void setSeansId(Long seansId) {
        this.seansId = seansId;
    }

    public List<Long> getSeats() {
        return seats;
    }

    public void setSeats(List<Long> seats) {
        this.seats = seats;
    }
}
