package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.dto.ImageDTO;
import com.casino.UserManagementSystem.entity.Image;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.repository.ImageRepo;
import com.casino.UserManagementSystem.repository.UsersRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageService {

    @Autowired
    private ImageRepo imageRepository;

    @Autowired
    private UsersRepo userRepository;

    public ImageDTO addImage(Integer userId, MultipartFile file) throws Exception {
        Optional<OurUsers> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }

        Image image = new Image();
        image.setUser(userOpt.get());
        image.setFileName(file.getOriginalFilename());
        image.setFileType(file.getContentType());
        image.setData(file.getBytes());

        image = imageRepository.save(image);

        return convertToDTO(image);
    }

    public List<Image> getImagesByUserId(Integer userId) {
        return imageRepository.findAll().stream()
                .filter(img -> img.getUser().getId() == userId)
                .collect(Collectors.toList());
    }

    public List<ImageDTO> getAllImages() {
        return imageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ImageDTO> getImageByUserId(Integer userId) {
        return imageRepository.findAll().stream()
                .filter(image -> image.getUser().getId() == userId)
                .findFirst()
                .map(this::convertToDTO);
    }

    @Transactional
    public boolean deleteImageById(Integer imageId) {
        Optional<Image> image = imageRepository.findById(imageId);
        if (image.isPresent()) {
            imageRepository.deleteById(imageId);
            return true;
        }
        return false;
    }

    public boolean hasImageForUser(int userId) {
        return imageRepository.findAll().stream()
                .anyMatch(image -> image.getUser().getId() == userId);
    }

    public void deleteByUser(OurUsers user) {
        Optional<Image> image = imageRepository.findAll().stream()
                .filter(img -> img.getUser().getId() == user.getId())
                .findFirst();
        image.ifPresent(imageRepository::delete);
    }

    public ImageDTO convertToDTO(Image image) {
        ImageDTO dto = new ImageDTO();
        dto.setId(image.getId());
        dto.setFileName(image.getFileName());
        dto.setFileType(image.getFileType());
        dto.setUserId(image.getUser().getId());
        dto.setImageBase64(Base64.getEncoder().encodeToString(image.getData()));
        return dto;
    }
}
