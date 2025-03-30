package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepo extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUser(OurUsers user);
}
