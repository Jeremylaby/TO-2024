package pl.agh.droptable.multiplex.controller;

import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.model.User;
import pl.agh.droptable.multiplex.repository.UserRepository;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping
    public User putUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @DeleteMapping
    public User deleteUser(@RequestBody String email) {
        return userRepository.removeByEmail(email);
    }

}
