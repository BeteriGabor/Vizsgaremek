package com.casino.UserManagementSystem.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

@Schema(description = "Request model for user registration")
public class RegisterRequestDTO {

    @Schema(description = "Email address of the user", required = true, example = "user@gmail.com")
    private String email;

    @Schema(description = "Username of the user", required = true, example = "user")
    private String username;

    @Schema(description = "Password of the user", required = true, example = "password")
    private String password;

    @Schema(description = "Birth date of the user", required = true, example = "2005-07-12")
    private Date birthDate;

    @Schema(description = "Role of the user", required = true, example = "USER")
    private String role;

//    private boolean acceptedAgeVerification;
//
//    // Getters and Setters
//    public boolean isAcceptedAgeVerification() {
//        return acceptedAgeVerification;
//    }
//
//    public void setAcceptedAgeVerification(boolean acceptedAgeVerification) {
//        this.acceptedAgeVerification = acceptedAgeVerification;
//    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
// Getters and Setters
}
