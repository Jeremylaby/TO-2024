package pl.agh.droptable.multiplex.dto;

public class AddReservationRequest {
    private Long userId;
    private Long seansId;
    private Long seatId;

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

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }
}
