package com.quizmaster.service;

import com.quizmaster.dto.SubmitQuizRequest;
import com.quizmaster.entity.Result;

import java.util.List;

public interface ResultService {

    Result saveResult(SubmitQuizRequest request);

    List<Result> leaderboard();

    List<Result> getTop5Performers();

    List<Result> getAllResults();

    List<Result> getUserResults(String email);

}