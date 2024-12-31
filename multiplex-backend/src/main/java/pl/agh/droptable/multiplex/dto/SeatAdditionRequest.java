package pl.agh.droptable.multiplex.dto;

import pl.agh.droptable.multiplex.model.Room;

public class SeatAdditionRequest {
    private String roomName;
    private int row;
    private int seatNumber;

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }
}
