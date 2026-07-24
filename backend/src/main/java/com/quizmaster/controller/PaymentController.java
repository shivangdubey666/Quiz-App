package com.quizmaster.controller;

import com.quizmaster.entity.User;
import com.quizmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private UserRepository repository;

    @PostMapping("/{email}")
    public String paymentSuccess(@PathVariable String email){

        User user=repository.findByEmail(email).orElse(null);

        if(user==null){

            return "User Not Found";

        }

        user.setPaymentDone(true);

        repository.save(user);

        return "Payment Successful";

    }

}