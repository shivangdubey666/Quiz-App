package com.quizmaster.repository;

import com.quizmaster.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
    
}