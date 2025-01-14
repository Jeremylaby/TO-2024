package pl.agh.droptable.multiplex.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.droptable.multiplex.service.MovieService;
import pl.agh.droptable.multiplex.service.ReservationService;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final MovieService movieService;
    private final ReservationService reservationService;


    public AnalyticsController(MovieService movieService, ReservationService reservationService) {
        this.movieService = movieService;
        this.reservationService = reservationService;
    }

    @GetMapping("/movies")
    public List<HashMap<String, Object>> getMovies() {
        return movieService.getNMostProfitableMovies(10);
    }
}
