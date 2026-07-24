package com.quizmaster.dto;

public class LoginResponse {

    private Long id;
    private String username;
    private String email;
    private boolean paymentDone;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(Long id,
                     String username,
                     String email,
                     boolean paymentDone,
                     String role) {

    this.id = id;
    this.username = username;
    this.email = email;
    this.paymentDone = paymentDone;
    this.role = role;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
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

    public void setEmail(String email){
        this.email=email;
    }

    public boolean isPaymentDone() {
        return paymentDone;
    }

    public void setPaymentDone(boolean paymentDone){
        this.paymentDone=paymentDone;
    }

    public String getRole() {
    return role;
}

public void setRole(String role) {
    this.role = role;
}

}