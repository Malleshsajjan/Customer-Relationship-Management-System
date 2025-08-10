package com.crm.controller;

import com.crm.model.LoginRequest;
import com.crm.model.User;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api") // Make sure this is present!
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 🔹 Registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());
        user.setRole("consumer");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful!",
                        "role", user.getRole(),
                        "userId", user.getUserId(),
                        "name", user.getName(),
                        "email", user.getEmail()
                ));

            } else {
                return ResponseEntity.status(401).body("Incorrect password.");
            }
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }
}
