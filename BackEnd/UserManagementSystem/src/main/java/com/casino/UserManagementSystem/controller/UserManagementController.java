package com.casino.UserManagementSystem.controller;
import com.casino.UserManagementSystem.dto.LoginRequestDTO;
import com.casino.UserManagementSystem.dto.RegisterRequestDTO;
import com.casino.UserManagementSystem.dto.ReqRes;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserManagementController {
    @Autowired
    private UsersManagementService usersManagementService;

    // Register user
    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ReqRes> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        // A register metódus a szolgáltatáson keresztül fogja elvégezni a felhasználó regisztrálását
        ReqRes response = usersManagementService.register(registerRequestDTO);
        return ResponseEntity.ok(response);
    }

    // Login user
    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        // A login metódus a szolgáltatáson keresztül fogja elvégezni a felhasználó beléptetését
        ReqRes response = usersManagementService.login(loginRequestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        System.out.println("asd4");
        return ResponseEntity.ok(usersManagementService.getAllUsers());

    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }


}