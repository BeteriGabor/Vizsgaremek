package com.casino.UserManagementSystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private OurUsers user;

    private BigDecimal balance;
    private LocalDateTime lastUpdated;

    public Wallet() {
    }

    public Wallet(OurUsers user, BigDecimal balance) {
        this.user = user;
        this.balance = balance;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public OurUsers getUser() {
        return user;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
        this.lastUpdated = LocalDateTime.now();
    }
}
