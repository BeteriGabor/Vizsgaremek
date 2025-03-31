package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers,Integer> {
    Optional<OurUsers> findByUsername(String username);
    @Modifying
    @Query("DELETE FROM Wallet w WHERE w.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

}
