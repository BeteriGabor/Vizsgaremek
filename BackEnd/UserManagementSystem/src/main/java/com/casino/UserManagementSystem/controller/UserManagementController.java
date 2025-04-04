package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.dto.*;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.repository.UsersRepo;
import com.casino.UserManagementSystem.service.UsersManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    @Autowired
    private UsersRepo usersRepo;

    @PostMapping("/auth/register")
    @Operation(summary = "Register New User", description = "Registers a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid registration data")
    })
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ReqRes> register(@RequestBody @Parameter(description = "User registration data") RegisterRequestDTO registerRequestDTO) {
        ReqRes response = usersManagementService.register(registerRequestDTO);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/auth/login")
    @Operation(summary = "Login User", description = "Logs in the user and provides authentication token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged in"),
            @ApiResponse(responseCode = "400", description = "Invalid login credentials")
    })
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
    @GetMapping("/auth/get-profile")
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



    @PutMapping("/auth/update-password")
    @Operation(
            summary = "Change Password",
            description = "Allows the user to change their password. It checks if the old password is correct before setting the new one."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password successfully updated", content = @Content(schema = @Schema(type = "string", example = "Password updated successfully"))),
            @ApiResponse(responseCode = "400", description = "Old password is incorrect", content = @Content(schema = @Schema(type = "string", example = "Old password is incorrect"))),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(schema = @Schema(type = "string", example = "User not found"))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(schema = @Schema(type = "string", example = "An error occurred while updating the password")))
    })
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        // Az authentikált felhasználó lekérése
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // A felhasználó lekérése a username alapján
        Optional<OurUsers> userOptional = usersManagementService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        OurUsers user = userOptional.get();

        // Ellenőrizzük, hogy a régi jelszó helyes-e
        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body("Old password is incorrect");
        }

        // Az új jelszó beállítása és mentése
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));

        // Frissített felhasználó mentése (csak a jelszó)
        usersManagementService.updateUserPassword(user);  // Új metódust kell hozzáadni a service rétegben

        return ResponseEntity.ok("Password updated successfully");
    }
    // Admin Only: Accept Age Verification
    @Operation(summary = "Accept Age Verification", description = "Allows an admin to accept the age verification for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Age verification accepted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user or age verification data"),
            @ApiResponse(responseCode = "403", description = "Only admins can accept age verification")
    })
    @PutMapping("/admin/accept-age-verification/{userId}")
    public ResponseEntity<ReqRes> acceptAgeVerification(
            @PathVariable @Parameter(description = "User ID") Integer userId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().toString(); // Get the role of the authenticated user

        if (!role.contains("ADMIN")) {
            ReqRes errorResponse = new ReqRes();
            errorResponse.setStatusCode(403);
            errorResponse.setMessage("You do not have permission to accept age verification. Only admins can perform this action.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }



        // Proceed with accepting the age verification
        ReqRes response = usersManagementService.acceptAgeVerification(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}


