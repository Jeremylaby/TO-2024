package pl.agh.droptable.multiplex.service;

import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.model.Seat;
import pl.agh.droptable.multiplex.repository.SeansRepository;
import pl.agh.droptable.multiplex.repository.SeatRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeansService {
    private final SeansRepository seansRepository;
    private final SeatRepository seatRepository;
    private final ReservationService reservationService;

    public SeansService(SeansRepository seansRepository, SeatRepository seatRepository, ReservationService reservationService) {
        this.seansRepository = seansRepository;
        this.seatRepository = seatRepository;
        this.reservationService = reservationService;
    }

    public void addSeans(Seans seans) {
        seansRepository.save(seans);
    }

    public void deleteSeans(Long id) {
        seansRepository.deleteById(id);
    }

    public boolean isRoomAvailable(long roomId, Timestamp start, Timestamp end) {
        return seansRepository.findSeansByRoomAndDateRange(roomId, start, end).isEmpty();
    }
    public Optional<Seans> getSeansById(Long id) {
        return seansRepository.findById(id);
    }

    public List<Seans> getAllSeans() {
        return seansRepository.findAll();
    }

    public List<Seans> getAllSeans(Timestamp start, Timestamp end) {
        return seansRepository.findAllByStartBetween(start, end);
    }

    public List<Seans> getAllSeans(Timestamp start, Timestamp end, long movieId) {
        return seansRepository.findAllByStartBetweenAndMovie_IdOrderByRoomId(start, end, movieId);
    }

    public List<Seans> getAllSeansInRoom(Timestamp start, Timestamp end, long roomId) {
        return seansRepository.findAllByStartBetweenAndRoomIdOrderByMovieId(start, end, roomId);
    }

    public List<Seans> getAllSeansFrom(Timestamp startTime) {
        return seansRepository.findByStartAfter(startTime);
    }

    public List<Seans> getAllSeansForMovie(Long movieId) {
        return seansRepository.findAllByMovieId(movieId);
    }

    public List<Seat> getFreeSeats(Long seansId) {
        Seans seans = seansRepository.findById(seansId).orElse(null);

        if (seans == null) {
            System.out.println("Seans not found");   //TODO
            return List.of();
        }

        Room room = seans.getRoom();
        List<Seat> allSeats = seatRepository.findAllByRoomId(room.getId());

        return allSeats.stream()
                .filter(seat -> !reservationService.isSeatTaken(seansId, seat.getId()))
                .collect(Collectors.toList());
    }

}
