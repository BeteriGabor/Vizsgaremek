package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.entity.Bet;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.enums.BetStatus;
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

    // Bet elhelyezése
    public Bet placeBet(OurUsers user, BigDecimal amount) {
        // Ellenőrizzük, hogy a felhasználónak van-e elegendő pénze a fogadáshoz
        Wallet wallet = walletRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        BigDecimal balance = wallet.getBalance();

        if (balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        // Fogadás létrehozása
        Bet bet = new Bet();
        bet.setUser(user);
        bet.setAmount(amount);
        bet.setStatus(BetStatus.PENDING); // Kezdeti státusz

        // Csökkentjük a felhasználó egyenlegét
        wallet.setBalance(balance.subtract(amount));
        walletRepository.save(wallet);

        // Hozzáadjuk a fogadást az adatbázishoz
        betRepository.save(bet);

        // Visszaadjuk a fogadást
        return bet;
    }

    // Bet kimenetének meghatározása
    public void resolveBet(Bet bet, boolean win, BigDecimal multiplier) {
        // Ellenőrizzük a státuszt, hogy még ne oldották-e meg
        if (!bet.getStatus().equals("PENDING")) {
            throw new IllegalArgumentException("Bet has already been resolved");
        }

        // A szorzó alapján kiszámoljuk az eredményt
        BigDecimal amountWon = bet.getAmount().multiply(multiplier);

        // Nyerés vagy veszteség kezelése
        if (win) {
            // Ha nyer, hozzáadjuk a nyert összeget a felhasználó egyenlegéhez
            Wallet wallet = walletRepository.findByUser(bet.getUser()).orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
            wallet.setBalance(wallet.getBalance().add(amountWon));
            walletRepository.save(wallet);

            // A fogadás státuszának frissítése
            bet.setStatus(BetStatus.WIN);
        } else {
            // Ha veszít, a fogadás státuszának frissítése
            bet.setStatus(BetStatus.LOSE);
        }

        // A tranzakció rögzítése a "transaction" táblában (a tranzakciók rögzítésére is szükség van)
        Transaction transaction = new Transaction(bet.getUser(), bet.getAmount(), TransactionType.DEPOSIT);
        transactionRepository.save(transaction);

        // A frissített fogadás mentése
        betRepository.save(bet);
    }

    // Bet lekérdezése ID alapján
    public Optional<Bet> getBetById(Integer betId) {
        return betRepository.findById(betId);
    }
}
