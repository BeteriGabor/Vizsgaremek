package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.enums.TransactionType;
import com.casino.UserManagementSystem.service.TransactionService;
import com.casino.UserManagementSystem.service.UsersManagementService;
import com.casino.UserManagementSystem.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/auth/wallet")
public class WalletController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UsersManagementService usersManagementService;

    @Autowired
    private WalletService walletService;

    // Egyenleg lekérdezése
    @Operation(summary = "Get User Wallet Balance", description = "Fetches the current balance of the authenticated user's wallet")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched balance"),
            @ApiResponse(responseCode = "404", description = "User or Wallet not found")
    })
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Optional<OurUsers> user = usersManagementService.getUserByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        Optional<Wallet> wallet = walletService.getWalletByUserId(user.get().getId());
        if (wallet.isEmpty()) {
            return ResponseEntity.status(404).body("Wallet not found");
        }

        return ResponseEntity.ok(wallet.get().getBalance());
    }

    // Befizetés
    @Operation(summary = "Deposit Amount", description = "Deposits a specified amount into the user's wallet")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully deposited amount"),
            @ApiResponse(responseCode = "404", description = "User or Wallet not found")
    })
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestParam @Parameter(description = "Amount to be deposited") BigDecimal amount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<OurUsers> user = usersManagementService.getUserByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        // Transaction létrehozása
        Transaction transaction = transactionService.createTransaction(user.get(), amount, TransactionType.DEPOSIT);

        // Wallet frissítése
        Optional<Wallet> wallet = walletService.getWalletByUserId(user.get().getId());
        if (wallet.isPresent()) {
            Wallet existingWallet = wallet.get();
            existingWallet.setLastUpdated(LocalDateTime.now()); // Frissítés ideje
            walletService.saveWallet(existingWallet);
        } else {
            // Új wallet létrehozása, ha nincs
            Wallet newWallet = new Wallet();
            newWallet.setUser(user.get());
            newWallet.setBalance(amount);
            newWallet.setLastUpdated(LocalDateTime.now());
            walletService.saveWallet(newWallet);
        }

        return ResponseEntity.ok(transaction);
    }

    // Kivétel
    @Operation(summary = "Withdraw Amount", description = "Withdraws a specified amount from the user's wallet")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully withdrawn amount"),
            @ApiResponse(responseCode = "404", description = "User or Wallet not found"),
            @ApiResponse(responseCode = "400", description = "Insufficient balance")
    })
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestParam @Parameter(description = "Amount to be withdrawn") BigDecimal amount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<OurUsers> user = usersManagementService.getUserByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        // Transaction létrehozása
        Transaction transaction = transactionService.createTransaction(user.get(), amount, TransactionType.WITHDRAW);

        // Wallet frissítése
        Optional<Wallet> wallet = walletService.getWalletByUserId(user.get().getId());
        if (wallet.isPresent()) {
            Wallet existingWallet = wallet.get();

            if (existingWallet.getBalance().compareTo(amount) < 0) {
                return ResponseEntity.status(400).body(null); // Ha nincs elég pénz
            }

            existingWallet.setLastUpdated(LocalDateTime.now()); // Frissítés ideje
            walletService.saveWallet(existingWallet);
        } else {
            return ResponseEntity.status(404).body(null); // Ha nincs wallet
        }

        return ResponseEntity.ok(transaction);
    }
}
