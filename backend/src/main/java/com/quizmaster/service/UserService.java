package com.quizmaster.service;

import com.quizmaster.dto.LoginRequest;
import com.quizmaster.dto.LoginResponse;
import com.quizmaster.dto.RegisterRequest;

public interface UserService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}