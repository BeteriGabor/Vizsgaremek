package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Bet;
import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Integer> {
    List<Bet> findByUser(OurUsers user);
}