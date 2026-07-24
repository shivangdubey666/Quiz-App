package com.quizmaster.controller;

import com.quizmaster.dto.SubmitQuizRequest;
import com.quizmaster.entity.Result;
import com.quizmaster.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/result")
@CrossOrigin("*")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping("/submit")
    public Result submitQuiz(@RequestBody SubmitQuizRequest request){

        return resultService.saveResult(request);

    }

    @GetMapping("/leaderboard")
    public List<Result> leaderboard(){

        return resultService.leaderboard();

    }

    @GetMapping("/top5")
    public List<Result> getTop5Performers() {
        return resultService.getTop5Performers();
    }

    @GetMapping("/all")
    public List<Result> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/user/{email}")
    public List<Result> getUserResults(@PathVariable String email) {
        return resultService.getUserResults(email);
    }

}