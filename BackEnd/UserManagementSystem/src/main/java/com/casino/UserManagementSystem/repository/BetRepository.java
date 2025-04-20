package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Bet;
import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Integer> {
    List<Bet> findByUser(OurUsers user);
    @Modifying
    @Query("DELETE FROM Bet b WHERE b.user.id = :userId")
    void deleteByUserId(@Param("userId") int userId);
}