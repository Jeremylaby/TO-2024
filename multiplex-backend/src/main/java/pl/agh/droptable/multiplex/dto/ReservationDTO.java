package pl.agh.droptable.multiplex.dto;

import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.model.Reservation;

import java.math.BigDecimal;
import java.sql.Timestamp;

public record ReservationDTO(
        Long id,
        boolean paid,
        Long userId,
        String firstName,
        String lastName,
        int row,
        int seatNumber,
        String roomName,
        BigDecimal price,
        Timestamp start,
        Timestamp endTime,
        Movie movie
) {

    public ReservationDTO(Reservation reservation) {
        this(
                reservation.getId(),
                reservation.isPaid(),
                reservation.getUser().getId(),
                reservation.getUser().getFirstName(),
                reservation.getUser().getLastName(),
                reservation.getSeat().getRow(),
                reservation.getSeat().getSeatNumber(),
                reservation.getSeans().getRoom().getName(),
                reservation.getSeans().getPrice(),
                reservation.getSeans().getStart(),
                reservation.getSeans().getEndTime(),
                reservation.getSeans().getMovie()
        );
    }
}

