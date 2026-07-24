package com.quizmaster.repository;

import com.quizmaster.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;



public interface QuizRepository extends JpaRepository<Quiz,Long> {
    
}
