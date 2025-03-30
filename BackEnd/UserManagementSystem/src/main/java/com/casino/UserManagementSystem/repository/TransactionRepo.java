package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(OurUsers user);
}
