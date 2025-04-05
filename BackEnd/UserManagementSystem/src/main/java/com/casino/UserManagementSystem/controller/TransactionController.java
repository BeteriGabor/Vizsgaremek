package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.dto.TransactionDTO;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.service.TransactionService;
import com.casino.UserManagementSystem.service.UsersManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UsersManagementService usersManagementService;

    @Operation(summary = "Get all transactions (Admin only)", description = "Lists all transactions in the system. Accessible only to admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched all transactions"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllTransactions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<OurUsers> userOpt = usersManagementService.getUserByUsername(username);

        if (userOpt.isEmpty() || !"ADMIN".equals(userOpt.get().getRole())) {
            return ResponseEntity.status(403).body("Access denied: Admins only.");
        }

        List<TransactionDTO> allTransactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(allTransactions);
    }

    @Operation(summary = "Get my transactions", description = "Returns all transactions for the currently logged-in user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched user transactions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/my")
    public ResponseEntity<?> getMyTransactions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<OurUsers> userOpt = usersManagementService.getUserByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<TransactionDTO> userTransactions = transactionService.getTransactionsByUser(userOpt.get());
        return ResponseEntity.ok(userTransactions);
    }
}
