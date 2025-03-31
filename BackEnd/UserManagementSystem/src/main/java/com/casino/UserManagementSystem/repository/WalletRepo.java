package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.entity.OurUsers;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepo extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUser(OurUsers user);
    Optional<Wallet> findByUserId(Integer userId);

    Optional<Wallet> findByUserUsername(String username);
    @Modifying
    @Transactional
    @Query("DELETE FROM Wallet w WHERE w.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);
}
