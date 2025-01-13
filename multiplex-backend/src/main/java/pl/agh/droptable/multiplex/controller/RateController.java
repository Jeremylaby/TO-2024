package pl.agh.droptable.multiplex.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.request.AddRateRequest;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.model.Rate;
import pl.agh.droptable.multiplex.model.User;
import pl.agh.droptable.multiplex.repository.MovieRepository;
import pl.agh.droptable.multiplex.repository.RateRepository;
import pl.agh.droptable.multiplex.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/rate")
public class RateController {
    private final RateRepository rateRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public RateController(RateRepository rateRepository, UserRepository userRepository, MovieRepository movieRepository) {
        this.rateRepository = rateRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    @PostMapping
    public ResponseEntity<?> addRate(@RequestBody AddRateRequest request) {
        Optional<User> optionalUser = userRepository.findById(request.getUser().getId());

        if (optionalUser.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        Optional<Movie> optionalMovie = movieRepository.findById(request.getMovie().getId());

        if (optionalMovie.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Movie not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        Rate rate = new Rate();
        rate.setRate(request.getRate());
        rate.setUser(request.getUser());
        rate.setMovie(request.getMovie());

        rateRepository.save(rate);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Rate added successfully!");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public void deleteRate(@PathVariable long id) { rateRepository.deleteById(id); }

    @GetMapping("/movie/{id}")
    public ResponseEntity<Double> getAverageRateForMovie(@PathVariable long id) {
        Double averageRate = rateRepository.findAverageByMovieId(id);
        return ResponseEntity.ok(averageRate);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Rate>> getRatesForUser(@PathVariable long id) {
        List<Rate> ratesForUser = rateRepository.findByUserId(id);
        return ResponseEntity.ok(ratesForUser);
    }
}
