package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.enums.TransactionType;
import com.casino.UserManagementSystem.service.TransactionService;
import com.casino.UserManagementSystem.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/auth/wallet")
public class WalletController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UsersManagementService usersManagementService;

    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestParam BigDecimal amount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Itt felhasználónevet kapunk
        Optional<OurUsers> user = usersManagementService.getUserByUsername(username); // Felhasználónév alapján keresés

        if (user == null) {
            return ResponseEntity.status(404).body(null); // Ha nem találjuk a felhasználót
        }

        Transaction transaction = transactionService.createTransaction(user.get(), amount, TransactionType.DEPOSIT);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestParam BigDecimal amount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Itt felhasználónevet kapunk
        Optional<OurUsers> user = usersManagementService.getUserByUsername(username); // Felhasználónév alapján keresés

        if (user == null) {
            return ResponseEntity.status(404).body(null); // Ha nem találjuk a felhasználót
        }

        // Ellenőrizhetjük, hogy van-e elég pénz a felhasználónál a kivonáshoz
        // Ezt a feltételt itt még hozzáadhatjuk, ha szükséges

        Transaction transaction = transactionService.createTransaction(user.get(), amount, TransactionType.WITHDRAW);
        return ResponseEntity.ok(transaction);
    }
//    @GetMapping("/balance")
//    public ResponseEntity<BigDecimal> getBalance() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName(); // Itt felhasználónevet kapunk
//        Optional<OurUsers> user = usersManagementService.getUserByUsername(username); // Felhasználónév alapján keresés
//
//        if (user.isEmpty()) {
//            return ResponseEntity.status(404).body(null); // Ha nem találjuk a felhasználót
//        }
//
//        // Feltételezve, hogy a felhasználóhoz tartozó wallet vagy egyenleg mezőt egy egyszerű getter metódussal elérhetjük
//        BigDecimal balance = user.get().getWallet().getBalance(); // Ez a wallet és balance elérhetőségétől függ
//
//        return ResponseEntity.ok(balance);
//    }


}
