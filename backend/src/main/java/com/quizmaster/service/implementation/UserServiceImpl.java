package com.quizmaster.service.implementation;

import com.quizmaster.dto.LoginRequest;
import com.quizmaster.dto.LoginResponse;
import com.quizmaster.dto.RegisterRequest;
import com.quizmaster.entity.User;
import com.quizmaster.repository.UserRepository;
import com.quizmaster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repository;

    @Override
    public String register(RegisterRequest request) {

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return "Email Already Registered";
        }

        if (repository.existsByUsername(request.getUsername())) {
            return "Username Already Exists";
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setCollege(request.getCollege());
        user.setCourse(request.getCourse());
        user.setPaymentDone(false);
        user.setRole("STUDENT");

        repository.save(user);

        return "Registration Successful";


    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = repository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return null;
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return null;
        }

        return new LoginResponse(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.isPaymentDone(),
        user.getRole()
);
}
}