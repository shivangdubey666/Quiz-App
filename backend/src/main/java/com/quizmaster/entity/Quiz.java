package com.quizmaster.entity;

import jakarta.persistence.*;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int price;

    public Quiz() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title=title;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price=price;
    }

}