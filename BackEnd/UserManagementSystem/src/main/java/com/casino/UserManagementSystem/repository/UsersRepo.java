package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers,Integer> {
    Optional<OurUsers> findByUsername(String username);
}
