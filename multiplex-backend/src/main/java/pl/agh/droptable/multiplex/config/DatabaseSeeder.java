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
            Genre thriller = new Genre();
            thriller.setName("Thriller");
            Genre sciFi = new Genre();
            sciFi.setName("Sci-Fi");
            Genre romance = new Genre();
            romance.setName("Romance");
            Genre adventure = new Genre();
            adventure.setName("Adventure");

            List<Genre> genres = genreRepository.saveAll(Arrays.asList(action, drama, comedy, thriller, sciFi,
                                                                       romance, adventure));

            // Create movies
            Movie inception = new Movie();
            inception.setTitle("Inception");
            inception.setDirector("Christopher Nolan");
            inception.setDuration(148);
            inception.setGenres(Arrays.asList(action, drama, sciFi));
            inception.setImageUrl("https://m.media-amazon.com/images/I/912AErFSBHL._AC_UF894,1000_QL80_.jpg");

            Movie pulpFiction = new Movie();
            pulpFiction.setTitle("Pulp Fiction");
            pulpFiction.setDirector("Quentin Tarantino");
            pulpFiction.setDuration(154);
            pulpFiction.setGenres(Arrays.asList(drama));
            pulpFiction.setImageUrl("https://m.media-amazon.com/images/I/81UTs3sC5hL._AC_UF894,1000_QL80_.jpg");

            Movie hangover = new Movie();
            hangover.setTitle("The Hangover");
            hangover.setDirector("Todd Phillips");
            hangover.setDuration(100);
            hangover.setGenres(Arrays.asList(comedy));
            hangover.setImageUrl("https://m.media-amazon.com/images/I/91pvafw44bL._AC_UF894,1000_QL80_.jpg");

            Movie matrix = new Movie();
            matrix.setTitle("The Matrix");
            matrix.setDirector("Lana Wachowski, Lilly Wachowski");
            matrix.setDuration(136);
            matrix.setGenres(Arrays.asList(action, sciFi));
            matrix.setImageUrl("https://m.media-amazon.com/images/I/51EG732BV3L._AC_UF894,1000_QL80_.jpg");

            Movie titanic = new Movie();
            titanic.setTitle("Titanic");
            titanic.setDirector("James Cameron");
            titanic.setDuration(195);
            titanic.setGenres(Arrays.asList(drama, romance));
            titanic.setImageUrl("https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_.jpg");

            Movie interstellar = new Movie();
            interstellar.setTitle("Interstellar");
            interstellar.setDirector("Christopher Nolan");
            interstellar.setDuration(169);
            interstellar.setGenres(Arrays.asList(sciFi, drama, adventure));
            interstellar.setImageUrl("https://m.media-amazon.com/images/I/91UMpWgj05L._AC_UF894,1000_QL80_.jpg");

            Movie shrek = new Movie();
            shrek.setTitle("Shrek");
            shrek.setDirector("Andrew Adamson, Vicky Jenson");
            shrek.setDuration(90);
            shrek.setGenres(Arrays.asList(comedy, adventure));
            shrek.setImageUrl("https://m.media-amazon.com/images/S/pv-target-images/a87ca2b4182bd152604d7f53b53abb753087c9a76d337e2d9c0cd6d874198d83.jpg");

            Movie gladiator = new Movie();
            gladiator.setTitle("Gladiator");
            gladiator.setDirector("Ridley Scott");
            gladiator.setDuration(155);
            gladiator.setGenres(Arrays.asList(action, drama));
            gladiator.setImageUrl("https://m.media-amazon.com/images/I/718zm68WXyL._AC_UF894,1000_QL80_.jpg");

            Movie toyStory = new Movie();
            toyStory.setTitle("Toy Story");
            toyStory.setDirector("John Lasseter");
            toyStory.setDuration(81);
            toyStory.setGenres(Arrays.asList(comedy, adventure));
            toyStory.setImageUrl("https://m.media-amazon.com/images/I/71N8Kav4AtL._AC_UF1000,1000_QL80_.jpg");

            Movie minions = new Movie();
            minions.setTitle("Minions");
            minions.setDirector("Kyle Balda, Pierre Coffin");
            minions.setDuration(91);
            minions.setGenres(Arrays.asList(comedy, adventure));
            minions.setImageUrl("https://m.media-amazon.com/images/I/61js0ctqAJL._AC_UF894,1000_QL80_.jpg");

            List<Movie> movies = movieRepository.saveAll(Arrays.asList(inception, pulpFiction, hangover, matrix,
                    titanic, interstellar, shrek, gladiator, toyStory, minions));


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
            admin.setPermissionLevel(Role.ADMINISTRATOR.getValue());
            

            User user1 = new User();
            user1.setEmail("john@example.com");
            user1.setName("John Doe");
            user1.setPassword(passwordEncoder.encode("password"));
            user1.setPermissionLevel(Role.NORMAL_USER.getValue());

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

            Seans seans3 = new Seans();
            seans3.setMovie(hangover);
            seans3.setRoom(room1);
            seans3.setStart(Timestamp.valueOf(seans1.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans3.setEndTime(Timestamp.valueOf(seans3.getStart().toLocalDateTime().plusMinutes(hangover.getDuration())));
            seans3.setPrice(new BigDecimal("20.00"));

            Seans seans4 = new Seans();
            seans4.setMovie(matrix);
            seans4.setRoom(room2);
            seans4.setStart(Timestamp.valueOf(seans2.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans4.setEndTime(Timestamp.valueOf(seans4.getStart().toLocalDateTime().plusMinutes(matrix.getDuration())));
            seans4.setPrice(new BigDecimal("24.00"));

            Seans seans5 = new Seans();
            seans5.setMovie(titanic);
            seans5.setRoom(room1);
            seans5.setStart(Timestamp.valueOf(seans3.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans5.setEndTime(Timestamp.valueOf(seans5.getStart().toLocalDateTime().plusMinutes(titanic.getDuration())));
            seans5.setPrice(new BigDecimal("26.00"));

            Seans seans6 = new Seans();
            seans6.setMovie(interstellar);
            seans6.setRoom(room2);
            seans6.setStart(Timestamp.valueOf(seans4.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans6.setEndTime(Timestamp.valueOf(seans6.getStart().toLocalDateTime().plusMinutes(interstellar.getDuration())));
            seans6.setPrice(new BigDecimal("28.00"));

            Seans seans7 = new Seans();
            seans7.setMovie(shrek);
            seans7.setRoom(room1);
            seans7.setStart(Timestamp.valueOf(seans5.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans7.setEndTime(Timestamp.valueOf(seans7.getStart().toLocalDateTime().plusMinutes(shrek.getDuration())));
            seans7.setPrice(new BigDecimal("18.00"));

            Seans seans8 = new Seans();
            seans8.setMovie(gladiator);
            seans8.setRoom(room2);
            seans8.setStart(Timestamp.valueOf(seans6.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans8.setEndTime(Timestamp.valueOf(seans8.getStart().toLocalDateTime().plusMinutes(gladiator.getDuration())));
            seans8.setPrice(new BigDecimal("27.00"));

            Seans seans9 = new Seans();
            seans9.setMovie(toyStory);
            seans9.setRoom(room1);
            seans9.setStart(Timestamp.valueOf(seans7.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans9.setEndTime(Timestamp.valueOf(seans9.getStart().toLocalDateTime().plusMinutes(toyStory.getDuration())));
            seans9.setPrice(new BigDecimal("15.00"));

            Seans seans10 = new Seans();
            seans10.setMovie(minions);
            seans10.setRoom(room2);
            seans10.setStart(Timestamp.valueOf(seans8.getEndTime().toLocalDateTime().plusMinutes(30)));
            seans10.setEndTime(Timestamp.valueOf(seans10.getStart().toLocalDateTime().plusMinutes(minions.getDuration())));
            seans10.setPrice(new BigDecimal("25.00"));

            List<Seans> seanses = seansRepository.saveAll(Arrays.asList(seans1, seans2, seans3, seans4, seans5, seans6, seans7, seans8, seans9, seans10));

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