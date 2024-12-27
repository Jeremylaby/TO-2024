package pl.agh.droptable.multiplex.service;

import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.repository.SeansRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class SeansService {
    private final SeansRepository seansRepository;

    public SeansService(SeansRepository seansRepository) {
        this.seansRepository = seansRepository;
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

}
