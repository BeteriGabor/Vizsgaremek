package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.dto.ImageDTO;
import com.casino.UserManagementSystem.entity.Image;
import com.casino.UserManagementSystem.repository.ImageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
public class ImageService {

    @Autowired
    private ImageRepo imageRepo;

    // Kép feltöltése
    public ImageDTO addImage(Integer userId, MultipartFile file) throws IOException {
        // Ellenőrizze, hogy a fájl valóban egy kép
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Csak képfájlok tölthetők fel!");
        }

        // Ha a fájl típus helyes, akkor folytatjuk a feltöltést
        Image image = new Image();
        image.setFileName(file.getOriginalFilename());
        image.setFileType(contentType);
        image.setData(file.getBytes());
        image.setUserId(userId); // A userId beállítása

        // A fájl mentése az adatbázisba
        Image savedImage = imageRepo.save(image);

        // DTO visszaadása Base64 kódolt képpel
        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setFileName(savedImage.getFileName());
        imageDTO.setFileType(savedImage.getFileType());
        imageDTO.setId(savedImage.getId());
        imageDTO.setImageBase64(Base64.getEncoder().encodeToString(savedImage.getData())); // Base64 kódolás

        return imageDTO;
    }

    // Képek lekérése felhasználó ID alapján
    public List<Image> getImagesByUserId(Integer userId) {
        return imageRepo.findByUserId(userId);
    }

    // Összes kép lekérése Base64 kódolással
    public List<ImageDTO> getAllImages() {
        List<Image> images = imageRepo.findAll();
        return images.stream().map(image -> {
            ImageDTO imageDTO = new ImageDTO();
            imageDTO.setId(image.getId());
            imageDTO.setFileName(image.getFileName());
            imageDTO.setFileType(image.getFileType());
            imageDTO.setUserId(image.getUserId());
            imageDTO.setImageBase64(Base64.getEncoder().encodeToString(image.getData())); // Base64 kódolás
            return imageDTO;
        }).collect(Collectors.toList());
    }
}
