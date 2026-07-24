package com.quizmaster.controller;

import com.quizmaster.entity.Question;
import com.quizmaster.entity.Quiz;
import com.quizmaster.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin("*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {

        return quizService.createQuiz(quiz);

    }

    @PostMapping("/{id}/question")
    public Question addQuestion(@PathVariable Long id,
                                @RequestBody Question question) {

        return quizService.addQuestion(id, question);

    }

    @GetMapping
    public List<Quiz> getAllQuiz() {

        return quizService.getAllQuiz();

    }

    @GetMapping("/{id}")
    public List<Question> getQuestions(@PathVariable Long id) {

        return quizService.getQuestions(id);

    }

    @GetMapping("/{id}/details")
    public Quiz getQuizDetails(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return "Quiz Deleted Successfully";
    }

    @DeleteMapping("/question/{questionId}")
    public String deleteQuestion(@PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return "Question Deleted Successfully";
    }

}