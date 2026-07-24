package com.quizmaster.controller;

import com.quizmaster.dto.LoginRequest;
import com.quizmaster.dto.LoginResponse;
import com.quizmaster.dto.RegisterRequest;
import com.quizmaster.repository.UserRepository;
import com.quizmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.quizmaster.entity.User;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){

        return userService.register(request);

    }

    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request){

    return userService.login(request);

}
@GetMapping("/users")
public List<User> getAllUsers() {
    return userRepository.findAll();
}

}