package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.entity.Bet;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.service.BetService;
import com.casino.UserManagementSystem.service.UsersManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
public class BetController {

    @Autowired
    private BetService betService;

    @Autowired
    private UsersManagementService usersManagementService;

    @Operation(
            summary = "Place a bet",
            description = "Allows the user to place a bet with a specified amount and multiplier. Checks if the user has enough balance."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bet placed successfully"),
            @ApiResponse(responseCode = "400", description = "Insufficient funds or invalid data")
    })
    @PostMapping("/auth/place")
    public ResponseEntity<String> placeBet(@RequestParam BigDecimal amount) {
        // Az autentikált felhasználó lekérése
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        OurUsers user = usersManagementService.getUserByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            // Fogadás elhelyezése
            Bet bet = betService.placeBet(user,amount);
            return ResponseEntity.ok("Bet placed successfully. Bet ID: " + bet.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Resolve a bet",
            description = "Resolve the bet by determining if the user won or lost. Adjusts the wallet balance accordingly."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bet resolved successfully"),
            @ApiResponse(responseCode = "400", description = "Bet not found or invalid data")
    })
    @PostMapping("/adminuser/resolve/{betId}")
    public ResponseEntity<String> resolveBet(@PathVariable Integer betId, @RequestParam boolean win, @RequestParam BigDecimal multiplier) {
        try {
            // Fogadás lekérése és státuszának frissítése
            Bet bet = betService.getBetById(Integer.valueOf(betId)).orElseThrow(() -> new IllegalArgumentException("Bet not found"));

            betService.resolveBet(bet, win, multiplier);
            return ResponseEntity.ok("Bet resolved successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
