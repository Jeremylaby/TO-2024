package pl.agh.droptable.multiplex.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.dto.AddSeansRequest;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.model.Room;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.service.MovieService;
import pl.agh.droptable.multiplex.service.RoomService;
import pl.agh.droptable.multiplex.service.SeansService;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
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
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "There is not such movie");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        if (roomOptional.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "There is not such room");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        Movie movie = movieOptional.get();
        Room room = roomOptional.get();
        LocalDateTime startTime = request.getStart().toLocalDateTime();
        LocalDateTime endTime = startTime.plusMinutes(MOVIE_DELAY + movie.getDuration());
        Timestamp start = Timestamp.valueOf(startTime);
        Timestamp end = Timestamp.valueOf(endTime);
        if(!seansService.isRoomAvailable(room.getId(), start,end)){
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Room is not available int that time range");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
        Seans newSeans = new Seans();
        newSeans.setMovie(movie);
        newSeans.setRoom(room);
        newSeans.setStart(start);
        newSeans.setEnd(end);
        seansService.addSeans(newSeans);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Seans added successful!");

        return ResponseEntity.ok(response);
    }
}
