package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Transaction;
import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUser(OurUsers user);

    @Modifying
    @Query("DELETE FROM Transaction t WHERE t.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

}
