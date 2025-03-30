package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.dto.*;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.service.UsersManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class UserManagementController {

    @Autowired
    private UsersManagementService usersManagementService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register user
    @Operation(summary = "Register New User", description = "Registers a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid registration data")
    })
    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ReqRes> register(@RequestBody @Parameter(description = "User registration data") RegisterRequestDTO registerRequestDTO) {
        ReqRes response = usersManagementService.register(registerRequestDTO);
        return ResponseEntity.ok(response);
    }

    // Login user
    @Operation(summary = "Login User", description = "Logs in the user and provides authentication token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged in"),
            @ApiResponse(responseCode = "400", description = "Invalid login credentials")
    })
    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody @Parameter(description = "User login credentials") LoginRequestDTO loginRequestDTO) {
        ReqRes response = usersManagementService.login(loginRequestDTO);
        return ResponseEntity.ok(response);
    }

    // Refresh Token
    @Operation(summary = "Refresh Authentication Token", description = "Refreshes the user's authentication token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token successfully refreshed"),
            @ApiResponse(responseCode = "400", description = "Invalid token or request data")
    })
    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody @Parameter(description = "Token refresh request data") ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    // Get All Users
    @Operation(summary = "Get All Users", description = "Fetches a list of all users in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched list of users"),
            @ApiResponse(responseCode = "404", description = "No users found")
    })
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    // Get User by ID
    @Operation(summary = "Get User by ID", description = "Fetches a specific user's details by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched user"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUserById(@PathVariable @Parameter(description = "User ID") Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));
    }

    // Update User
    @Operation(summary = "Update User", description = "Updates the details of a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid user data"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable @Parameter(description = "User ID") Integer userId,
                                             @RequestBody @Parameter(description = "Updated user data") OurUsers reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    // Get Profile
    @Operation(summary = "Get My Profile", description = "Fetches the profile information of the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched profile"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Delete User
    @Operation(summary = "Delete User", description = "Deletes a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully deleted user"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable @Parameter(description = "User ID") Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }
    @PutMapping("/auth/update-profile")
    @Operation(
            summary = "Update User Profile",
            description = "Allows the user to update their profile (e.g., username, email, birth date). The authenticated user's details will be modified."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<String> updateProfile(@Valid @RequestBody UpdateProfileDTO updateProfileDTO) {
        // Retrieving the authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Getting the user based on the username
        Optional<OurUsers> userOptional = usersManagementService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        OurUsers user = userOptional.get();

        // Updating profile
        if (updateProfileDTO.getUsername() != null) {
            user.setUsername(updateProfileDTO.getUsername());
        }
        if (updateProfileDTO.getEmail() != null) {
            user.setEmail(updateProfileDTO.getEmail());
        }
        if (updateProfileDTO.getBirthDate() != null) {
            user.setBirthDate(updateProfileDTO.getBirthDate());
        }

        // Updating user in the database
        usersManagementService.updateUser(user.getId(), user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    @PutMapping("/auth/update-password")
    @Operation(
            summary = "Change Password",
            description = "Allows the user to change their password. It checks if the old password is correct before setting the new one."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password successfully updated"),
            @ApiResponse(responseCode = "400", description = "Old password is incorrect"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<OurUsers> userOptional = usersManagementService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        OurUsers user = userOptional.get();

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        usersManagementService.updateUser(user.getId(), user);

        return ResponseEntity.ok("Password updated successfully");
    }

}


