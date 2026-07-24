package com.quizmaster.service.implementation;

import com.quizmaster.dto.SubmitQuizRequest;
import com.quizmaster.entity.Quiz;
import com.quizmaster.entity.Result;
import com.quizmaster.repository.QuizRepository;
import com.quizmaster.repository.ResultRepository;
import com.quizmaster.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Override
    public Result saveResult(SubmitQuizRequest request){

        Quiz quiz=quizRepository.findById(request.getQuizId()).orElse(null);

        Result result=new Result();

        result.setUsername(request.getUsername());
        result.setEmail(request.getEmail());
        result.setQuizName(quiz.getTitle());
        result.setScore(request.getScore());
        result.setTotalQuestions(request.getTotalQuestions());

        double percentage=((double)request.getScore()/request.getTotalQuestions())*100;

        result.setPercentage(percentage);

        result.setQuiz(quiz);

        return resultRepository.save(result);

    }

    @Override
public List<Result> leaderboard() {

    List<Result> allResults = resultRepository.findAllByOrderByPercentageDescScoreDesc();

    List<Result> leaderboard = new ArrayList<>();

    Set<String> emails = new HashSet<>();

    for (Result result : allResults) {

        if (!emails.contains(result.getEmail())) {

            leaderboard.add(result);

            emails.add(result.getEmail());

        }

    }

    return leaderboard;

}

}