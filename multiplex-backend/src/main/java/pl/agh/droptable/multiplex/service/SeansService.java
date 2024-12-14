package pl.agh.droptable.multiplex.service;

import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.repository.SeansRepository;

import java.sql.Timestamp;

@Service
public class SeansService {
    private final SeansRepository seansRepository;

    public SeansService(SeansRepository seansRepository) {
        this.seansRepository = seansRepository;
    }
    public void addSeans(Seans seans) {
        seansRepository.save(seans);
    }
    public boolean isRoomAvailable(long roomId, Timestamp start, Timestamp end) {
        return seansRepository.findSeansByRoomAndDateRange(roomId,start,end).isEmpty();
    }
}
