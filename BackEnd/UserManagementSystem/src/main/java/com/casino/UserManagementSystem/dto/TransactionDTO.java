package com.casino.UserManagementSystem.dto;

import com.casino.UserManagementSystem.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private TransactionType transactionType;

    public TransactionDTO(Long id, BigDecimal amount, LocalDateTime timestamp, TransactionType transactionType) {
        this.id = id;
        this.amount = amount;
        this.timestamp = timestamp;
        this.transactionType = transactionType;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
}
