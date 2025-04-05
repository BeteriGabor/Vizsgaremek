package com.casino.UserManagementSystem.repository;

import com.casino.UserManagementSystem.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepo extends JpaRepository<Image, Integer> {
    List<Image> findByUserId(Integer userId);
}
