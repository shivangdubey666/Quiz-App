package com.quizmaster.controller;

import com.quizmaster.entity.Purchase;
import com.quizmaster.entity.Quiz;
import com.quizmaster.entity.User;
import com.quizmaster.repository.PurchaseRepository;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    // Razorpay Test Mode Key (can be set to test key)
    private static final String RAZORPAY_KEY = "rzp_test_quizmaster_mock";

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        Long quizId = Long.parseLong(data.get("quizId").toString());
        String email = (String) data.get("email");

        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) {
            return ResponseEntity.badRequest().body("Quiz not found");
        }

        String orderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("amount", quiz.getPrice() * 100); // in paise
        response.put("currency", "INR");
        response.put("key", RAZORPAY_KEY);
        response.put("quizTitle", quiz.getTitle());
        response.put("quizPrice", quiz.getPrice());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> data) {
        String email = (String) data.get("email");
        String username = (String) data.get("username");
        Long quizId = Long.parseLong(data.get("quizId").toString());
        String paymentId = (String) data.getOrDefault("razorpayPaymentId", "pay_" + UUID.randomUUID().toString().substring(0, 10));
        String orderId = (String) data.getOrDefault("razorpayOrderId", "order_test");

        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) {
            return ResponseEntity.badRequest().body("Quiz not found");
        }

        // Check if already purchased
        if (!purchaseRepository.existsByEmailAndQuizId(email, quizId)) {
            Purchase purchase = new Purchase(
                    username != null ? username : email,
                    email,
                    quizId,
                    quiz.getTitle(),
                    quiz.getPrice(),
                    paymentId,
                    orderId
            );
            purchaseRepository.save(purchase);
        }

        Map<String, String> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("message", "Payment Verified and Quiz Unlocked!");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isPurchased(@RequestParam String email, @RequestParam Long quizId) {
        boolean purchased = purchaseRepository.existsByEmailAndQuizId(email, quizId);
        return ResponseEntity.ok(purchased);
    }

    @GetMapping("/purchases/{email}")
    public ResponseEntity<List<Purchase>> getUserPurchases(@PathVariable String email) {
        return ResponseEntity.ok(purchaseRepository.findByEmail(email));
    }

    @GetMapping("/purchases/all")
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        return ResponseEntity.ok(purchaseRepository.findAll());
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        List<Purchase> purchases = purchaseRepository.findAll();
        long totalRevenue = purchases.stream().mapToLong(Purchase::getAmount).sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalPurchases", purchases.size());
        return ResponseEntity.ok(stats);
    }
}