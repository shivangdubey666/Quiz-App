package com.quizmaster.service.implementation;

import com.quizmaster.entity.Question;
import com.quizmaster.entity.Quiz;
import com.quizmaster.repository.QuestionRepository;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public Quiz createQuiz(Quiz quiz) {

        return quizRepository.save(quiz);

    }

    @Override
    public Question addQuestion(Long quizId, Question question) {

        Quiz quiz = quizRepository.findById(quizId).orElse(null);

        if (quiz == null) {

            return null;

        }

        question.setQuiz(quiz);

        return questionRepository.save(question);

    }

    @Override
    public List<Question> getQuestions(Long quizId) {

        return questionRepository.findByQuizId(quizId);

    }

    @Override
    public List<Quiz> getAllQuiz() {

        return quizRepository.findAll();

    }

}