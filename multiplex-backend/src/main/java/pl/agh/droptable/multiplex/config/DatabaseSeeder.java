package pl.agh.droptable.multiplex.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.agh.droptable.multiplex.model.*;
import pl.agh.droptable.multiplex.repository.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DatabaseSeeder {
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner initDatabase(
            MovieRepository movieRepository,
            RoomRepository roomRepository,
            SeatRepository seatRepository,
            SeansRepository seansRepository,
            ReservationRepository reservationRepository,
            GenreRepository genreRepository,
            UserRepository userRepository
    ) {
        return args -> {
            // Check if database is empty
            if (movieRepository.count() > 0) {
                return; // Database already seeded
            }

            // Create genres
            Genre action = new Genre();
            action.setName("Action");
            Genre drama = new Genre();
            drama.setName("Drama");
            Genre comedy = new Genre();
            comedy.setName("Comedy");

            List<Genre> genres = genreRepository.saveAll(Arrays.asList(action, drama, comedy));

            // Create movies
            Movie inception = new Movie();
            inception.setTitle("Inception");
            inception.setDirector("Christopher Nolan");
            inception.setDuration(148);
            inception.setGenres(Arrays.asList(action, drama));

            Movie pulpFiction = new Movie();
            pulpFiction.setTitle("Pulp Fiction");
            pulpFiction.setDirector("Quentin Tarantino");
            pulpFiction.setDuration(154);
            pulpFiction.setGenres(Arrays.asList(drama));

            Movie hangover = new Movie();
            hangover.setTitle("The Hangover");
            hangover.setDirector("Todd Phillips");
            hangover.setDuration(100);
            hangover.setGenres(Arrays.asList(comedy));

            List<Movie> movies = movieRepository.saveAll(Arrays.asList(inception, pulpFiction, hangover));

            // Create rooms
            Room room1 = new Room();
            room1.setName("Sala 1");
            room1.setCapacity(50);

            Room room2 = new Room();
            room2.setName("Sala 2");
            room2.setCapacity(30);

            List<Room> rooms = roomRepository.saveAll(Arrays.asList(room1, room2));

            // Create seats for each room
            List<Seat> allSeats = new ArrayList<>();
            for (Room room : rooms) {
                for (int row = 1; row <= 5; row++) {
                    for (int seatNum = 1; seatNum <= room.getCapacity() / 5; seatNum++) {
                        Seat seat = new Seat();
                        seat.setRoom(room);
                        seat.setRow(row);
                        seat.setSeatNumber(seatNum);
                        allSeats.add(seat);
                    }
                }
            }
            seatRepository.saveAll(allSeats);

            // Create sample users
            User admin = new User();
            admin.setEmail("admin@admin.admin");
            admin.setName("John Doe");
            admin.setPassword(passwordEncoder.encode("password"));
            

            User user1 = new User();
            user1.setEmail("john@example.com");
            user1.setName("John Doe");

            User user2 = new User();
            user2.setEmail("jane@example.com");
            user2.setName("Jane Smith");

            List<User> users = userRepository.saveAll(Arrays.asList(user1, user2, admin));

            // Create seans (screenings)
            LocalDateTime now = LocalDateTime.now();

            Seans seans1 = new Seans();
            seans1.setMovie(inception);
            seans1.setRoom(room1);
            seans1.setStart(Timestamp.valueOf(now.plusDays(1)));
            seans1.setEndTime(Timestamp.valueOf(now.plusDays(1).plusMinutes(inception.getDuration())));
            seans1.setPrice(new BigDecimal("25.00"));

            Seans seans2 = new Seans();
            seans2.setMovie(pulpFiction);
            seans2.setRoom(room2);
            seans2.setStart(Timestamp.valueOf(now.plusDays(1)));
            seans2.setEndTime(Timestamp.valueOf(now.plusDays(1).plusMinutes(pulpFiction.getDuration())));
            seans2.setPrice(new BigDecimal("22.00"));

            List<Seans> seanses = seansRepository.saveAll(Arrays.asList(seans1, seans2));

            // Create some reservations
            Reservation reservation1 = new Reservation();
            reservation1.setUser(user1);
            reservation1.setSeans(seans1);
            reservation1.setSeat(allSeats.get(0)); // First seat
            reservation1.setPaid(true);
            reservation1.setPrice(seans1.getPrice());

            Reservation reservation2 = new Reservation();
            reservation2.setUser(user2);
            reservation2.setSeans(seans1);
            reservation2.setSeat(allSeats.get(1)); // Second seat
            reservation2.setPaid(true);
            reservation2.setPrice(seans1.getPrice());

            Reservation reservation3 = new Reservation();
            reservation3.setUser(user1);
            reservation3.setSeans(seans2);
            reservation3.setSeat(allSeats.get(room1.getCapacity())); // First seat in room 2
            reservation3.setPaid(true);
            reservation3.setPrice(seans2.getPrice());

            Reservation reservation4 = new Reservation();
            reservation4.setUser(user1);
            reservation4.setSeans(seans1);
            reservation4.setSeat(allSeats.get(room1.getCapacity())); // First seat in room 2
            reservation4.setPaid(false);
            reservation4.setPrice(seans1.getPrice());

            reservationRepository.saveAll(Arrays.asList(reservation1, reservation2, reservation3, reservation4));
        };
    }
}