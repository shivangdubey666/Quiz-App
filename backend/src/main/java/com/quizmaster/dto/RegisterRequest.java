package com.quizmaster.dto;

public class RegisterRequest {

    private String username;
    private String email;
    private String phone;
    private String password;
    private String college;
    private String course;

    public RegisterRequest() {
    }

   public String getUsername() {
    return username;
}

public void setUsername(String username) {
    this.username = username;
}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}