package pl.agh.droptable.multiplex.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.agh.droptable.multiplex.model.Movie;
import pl.agh.droptable.multiplex.model.Rate;
import pl.agh.droptable.multiplex.model.Seans;
import pl.agh.droptable.multiplex.repository.RateRepository;
import pl.agh.droptable.multiplex.repository.SeansRepository;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MovieRecommendationService {
    @Autowired
    private SeansRepository seansRepository;

    @Autowired
    private RateRepository rateRepository;

    public List<Movie> recommendMoviesBetweenTimestamps(Timestamp startTimestamp, Timestamp endTimestamp) {
        List<Seans> seansList = seansRepository.findAllByStartBetween(startTimestamp, endTimestamp);

        Map<Movie, List<Integer>> movieRatingsMap = new HashMap<>();

        for (Seans seans : seansList) {
            Movie movie = seans.getMovie();
            List<Rate> rates = rateRepository.findByMovieId(movie.getId());
            movieRatingsMap.putIfAbsent(movie, new ArrayList<>());
            rates.forEach(rate -> movieRatingsMap.get(movie).add(rate.getRate()));
        }

        return movieRatingsMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().stream().mapToInt(Integer::intValue).average().orElse(0)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<Movie, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
