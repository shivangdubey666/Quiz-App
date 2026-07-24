package com.quizmaster.repository;

import com.quizmaster.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    boolean existsByEmailAndQuizId(String email, Long quizId);

    List<Purchase> findByEmail(String email);

    @Query("SELECT SUM(p.amount) FROM Purchase p")
    Long getTotalRevenue();
}
