package com.casino.UserManagementSystem.dto;

import java.math.BigDecimal;

public class BetResolveDTO {
    private boolean win;
    private BigDecimal multiplier;

    public boolean isWin() {
        return win;
    }

    public void setWin(boolean win) {
        this.win = win;
    }

    public BigDecimal getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(BigDecimal multiplier) {
        this.multiplier = multiplier;
    }
}
