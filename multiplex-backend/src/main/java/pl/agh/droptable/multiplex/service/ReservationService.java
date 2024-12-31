package pl.agh.droptable.multiplex.service;

import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Reservation;
import pl.agh.droptable.multiplex.repository.ReservationRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    public void addReservation(Reservation reservation) {
        reservationRepository.save(reservation);
    }
    public void addReservations(List<Reservation> reservations) {
        reservationRepository.saveAll(reservations);
    }
    public Optional<Reservation> getReservation(Long id) {
        return reservationRepository.findById(id);
    }
    public void removeReservation(Reservation reservation) {
        reservationRepository.delete(reservation);
    }
    public List<Reservation> getUnpaidReservationsBefore(Timestamp timestamp) {
        return reservationRepository.findUnpaidReservationBefore(timestamp);
    }
    public boolean isSeatTaken(Long seansId, Long seatId){
        return reservationRepository.isSeatTaken(seansId,seatId).isPresent();
    }
    public List<Reservation> findReservationsByUserId(Long userId) {
        return reservationRepository.findAllByUserId(userId);
    }
    public List<Reservation> getReservations(){
        return reservationRepository.findAll();
    }
    public List<Reservation> findReservationsBetweenDates(Timestamp start, Timestamp end){
        return reservationRepository.findAllBetweenDates(start, end);
    }
}
