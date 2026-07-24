package com.quizmaster.controller;

import com.quizmaster.entity.User;
import com.quizmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private UserRepository repository;

    @GetMapping("/{email}")
    public User dashboard(@PathVariable String email){

        return repository.findByEmail(email).orElse(null);

    }

}