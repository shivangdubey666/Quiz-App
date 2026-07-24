package com.quizmaster.controller;

import com.quizmaster.entity.User;
import com.quizmaster.repository.QuestionRepository;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.repository.UserRepository;
import com.quizmaster.repository.PurchaseRepository;
import com.quizmaster.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private ResultRepository resultRepository;

    @GetMapping("/{email}")
    public User dashboard(@PathVariable String email){
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping("/stats/admin")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQuizzes", quizRepository.count());
        stats.put("totalQuestions", questionRepository.count());
        stats.put("totalStudents", userRepository.count());
        stats.put("totalPurchases", purchaseRepository.count());
        stats.put("totalResults", resultRepository.count());
        
        Long rev = purchaseRepository.getTotalRevenue();
        stats.put("totalRevenue", rev != null ? rev : 0);

        return ResponseEntity.ok(stats);
    }

}