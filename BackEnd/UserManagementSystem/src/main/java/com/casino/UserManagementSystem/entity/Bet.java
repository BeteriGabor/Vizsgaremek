package com.casino.UserManagementSystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bets")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private OurUsers user;

    private BigDecimal amount; // Fogadott összeg
    private BigDecimal multiplier; // Szorzó
    private String status; // PENDING, WIN, LOSE

    public Bet() {}

    public Bet(OurUsers user, BigDecimal amount, BigDecimal multiplier, String status) {
        this.user = user;
        this.amount = amount;
        this.multiplier = multiplier;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public OurUsers getUser() {
        return user;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getMultiplier() {
        return multiplier;
    }

    public String getStatus() {
        return status;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setMultiplier(BigDecimal multiplier) {
        this.multiplier = multiplier;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
