package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.repository.WalletRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class WalletService {

    @Autowired
    private WalletRepo walletRepository;

    public Wallet getOrCreateWallet(OurUsers user) {
        return walletRepository.findByUser(user)
                .orElseGet(() -> walletRepository.save(new Wallet(user, BigDecimal.ZERO)));
    }

    public void updateBalance(Wallet wallet, BigDecimal amount) {
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
    }
}
