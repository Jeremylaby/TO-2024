package pl.agh.droptable.multiplex.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pl.agh.droptable.multiplex.model.Seat;

import java.util.List;

public class RoomCreationRequest {
    @NotBlank(message = "Room name cannot be empty")
    private String roomName;

    @NotNull(message = "Seats list cannot be null")
    private List<Seat> seats;

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}

