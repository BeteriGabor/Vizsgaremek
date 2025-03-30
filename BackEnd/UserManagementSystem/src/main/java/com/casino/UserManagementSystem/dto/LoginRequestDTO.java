package com.casino.UserManagementSystem.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request model for user login")
public class LoginRequestDTO {

    @Schema(description = "Username of the user", required = true, example = "user")
    private String username;

    @Schema(description = "Password of the user", required = true, example = "password")
    private String password;

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
// Getters and Setters
}
