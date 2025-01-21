package pl.agh.droptable.multiplex.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.agh.droptable.multiplex.dto.request.LoginRequest;
import pl.agh.droptable.multiplex.dto.request.RegistrationRequest;
import pl.agh.droptable.multiplex.model.User;
import pl.agh.droptable.multiplex.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "User with this email already exists.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful!");

        return ResponseEntity.ok(response);
    }


//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//            HttpSession session = httpRequest.getSession(true);
//            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
//            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Login successful!");
//            response.put("id", user.getId());
//            response.put("firstName", user.getFirstName());
//            response.put("lastName", user.getLastName());
//            response.put("email", user.getEmail());
//            response.put("sessionId", session.getId());
//
//            return ResponseEntity.ok(response);
//        } catch (AuthenticationException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials."));
//        }
//    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail()
        ));
    }
}
