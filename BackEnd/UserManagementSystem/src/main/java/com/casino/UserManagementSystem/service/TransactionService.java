package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.dto.TransactionDTO;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.enums.TransactionType;
import com.casino.UserManagementSystem.repository.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepository;

    @Autowired
    private WalletService walletService;

    public Transaction createTransaction(OurUsers user, BigDecimal amount, TransactionType type) {
        Wallet wallet = walletService.getOrCreateWallet(user);

        if (type == TransactionType.WITHDRAW && wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        Transaction transaction = new Transaction(user, amount, type);
        transactionRepository.save(transaction);

        BigDecimal adjustedAmount = (type == TransactionType.WITHDRAW) ? amount.negate() : amount;
        walletService.updateBalance(wallet, adjustedAmount);

        return transaction;
    }

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(tx -> new TransactionDTO(tx.getId(), tx.getAmount(), tx.getTimestamp(), tx.getTransactionType()))
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByUser(OurUsers user) {
        return transactionRepository.findByUser(user).stream()
                .map(tx -> new TransactionDTO(tx.getId(), tx.getAmount(), tx.getTimestamp(), tx.getTransactionType()))
                .collect(Collectors.toList());
    }
}
