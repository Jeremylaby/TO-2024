package pl.agh.droptable.multiplex.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.AddSeansRequest;
import pl.agh.droptable.multiplex.dto.FindSeansRequest;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.service.MovieService;
import pl.agh.droptable.multiplex.service.RoomService;
import pl.agh.droptable.multiplex.service.SeansService;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@Transactional
@RequestMapping("api/seans")
public class SeansController {
    private final SeansService seansService;
    private final MovieService movieService;
    private final RoomService roomService;
    private final static int MOVIE_DELAY=30;

    public SeansController(SeansService seansService, MovieService movieService, RoomService roomService) {
        this.seansService = seansService;
        this.movieService = movieService;
        this.roomService = roomService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSeans(@Valid @RequestBody AddSeansRequest request) {
        Optional<Movie> movieOptional = movieService.getMovieById(request.getMovieId());
        Optional<Room> roomOptional = roomService.getRoom(request.getRoomId());
        if (movieOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such movie"));
        }
        if (roomOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "There is not such room"));
        }

        Movie movie = movieOptional.get();
        Room room = roomOptional.get();
        LocalDateTime startTime = request.getStart().toLocalDateTime();
        LocalDateTime endTime = startTime.plusMinutes(MOVIE_DELAY + movie.getDuration());
        Timestamp start = Timestamp.valueOf(startTime);
        Timestamp end = Timestamp.valueOf(endTime);
        if(!seansService.isRoomAvailable(room.getId(), start,end)){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Room is not available int that time range"));
        }
        Seans newSeans = new Seans();
        newSeans.setMovie(movie);
        newSeans.setRoom(room);
        newSeans.setStart(start);
        newSeans.setEnd(end);
        newSeans.setPrice(request.getPrice());
        seansService.addSeans(newSeans);

        return ResponseEntity.ok(Map.of("message", "Seans added successful!"));
    }
    @DeleteMapping({"/{id}"})
    public void deleteSeans(@PathVariable("id") Long id) {
        seansService.deleteSeans(id);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Seans>> getAllSeans() {
        List<Seans> seansList = seansService.getAllSeans();
        return ResponseEntity.ok(seansList);
    }
    @GetMapping("/all/between-dates")
    public ResponseEntity<List<Seans>> getBetweenDates(FindSeansRequest request) {
        List<Seans> seansList = seansService.getAllSeans(request.getStart(), request.getEnd());
        return ResponseEntity.ok(seansList);
    }
    @GetMapping("/all/between-dates-room")
    public ResponseEntity<List<Seans>> getBetweenDatesInRoom(FindSeansRequest request) {
        List<Seans> seansList = seansService.getAllSeansInRoom(request.getStart(), request.getEnd(), request.getRoomId());
        return ResponseEntity.ok(seansList);
    }
    @GetMapping("/all/between-dates-movie")
    public ResponseEntity<List<Seans>> getBetweenDatesMovie(FindSeansRequest request) {
        List<Seans> seansList = seansService.getAllSeans(request.getStart(), request.getEnd(), request.getMovieId());
        return ResponseEntity.ok(seansList);
    }

}
