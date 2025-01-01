package pl.agh.droptable.multiplex.controller;

import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.UserDTO;
import pl.agh.droptable.multiplex.model.User;
import pl.agh.droptable.multiplex.repository.UserRepository;

import java.util.List;

@RestController
@Transactional
@RequestMapping("api/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping
    public User updateUser(@RequestBody UserDTO user) {
        return userRepository.save(user.toUser());
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(Long.parseLong(id));
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

}
