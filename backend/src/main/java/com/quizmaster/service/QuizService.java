package com.quizmaster.service;

import com.quizmaster.entity.Question;
import com.quizmaster.entity.Quiz;

import java.util.List;

public interface QuizService {

    Quiz createQuiz(Quiz quiz);

    Question addQuestion(Long quizId, Question question);

    List<Question> getQuestions(Long quizId);

    List<Quiz> getAllQuiz();

}