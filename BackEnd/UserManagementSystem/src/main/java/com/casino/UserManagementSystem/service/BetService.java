package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.entity.Bet;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.enums.TransactionType;
import com.casino.UserManagementSystem.repository.BetRepository;
import com.casino.UserManagementSystem.repository.TransactionRepo;
import com.casino.UserManagementSystem.repository.WalletRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class BetService {

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private WalletRepo walletRepository;

    @Autowired
    private TransactionRepo transactionRepository;

    @Autowired
    private UsersManagementService usersManagementService;

    public Bet placeBet(OurUsers user, BigDecimal amount) {
        Wallet wallet = walletRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        BigDecimal balance = wallet.getBalance();

        if (balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        Bet bet = new Bet();
        bet.setUser(user);
        bet.setAmount(amount);
        bet.setStatus("PENDING");

        wallet.setBalance(balance.subtract(amount));
        walletRepository.save(wallet);

        betRepository.save(bet);

        return bet;
    }

    public void resolveBet(Bet bet, boolean win, BigDecimal multiplier) {
        if (!bet.getStatus().equals("PENDING")) {
            throw new IllegalArgumentException("Bet has already been resolved");
        }

        BigDecimal amountWon = bet.getAmount().multiply(multiplier);

        if (win) {
            Wallet wallet = walletRepository.findByUser(bet.getUser()).orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
            wallet.setBalance(wallet.getBalance().add(amountWon));
            walletRepository.save(wallet);

            bet.setStatus("WIN");
        } else {
            bet.setStatus("LOSE");
        }

        Transaction transaction = new Transaction(
                bet.getUser(),
                win ? bet.getAmount() : bet.getAmount().negate(),
                TransactionType.BET
        );
        transactionRepository.save(transaction);



        // A frissített fogadás mentése
        betRepository.save(bet);
    }

    // Bet lekérdezése ID alapján
    public Optional<Bet> getBetById(Integer betId) {
        return betRepository.findById(betId);
    }
}
