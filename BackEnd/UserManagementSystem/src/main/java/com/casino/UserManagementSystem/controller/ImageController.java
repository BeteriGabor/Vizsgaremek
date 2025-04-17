package com.casino.UserManagementSystem.controller;

import com.casino.UserManagementSystem.dto.ImageDTO;
import com.casino.UserManagementSystem.entity.Image;
import com.casino.UserManagementSystem.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ImageController {

    @Autowired
    private ImageService imageService;

    // Kép feltöltése (már létezett)
    @PostMapping("/api/images/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("userId") Integer userId,
                                         @RequestParam("file") MultipartFile file) {
        try {
            ImageDTO imageDTO = imageService.addImage(userId, file);
            return new ResponseEntity<>(imageDTO, HttpStatus.CREATED);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Hiba történt a fájl feltöltésekor.");
        }
    }

    // Képek lekérése felhasználó ID alapján
    @GetMapping("/admin/userImage/{userId}")
    public ResponseEntity<?> getImagesByUserId(@PathVariable Integer userId) {
        try {
            List<Image> images = imageService.getImagesByUserId(userId);
            if (images.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nincs feltöltött kép a megadott felhasználóhoz.");
            }
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Hiba történt a képek lekérésekor.");
        }
    }
    // Összes kép lekérése
    @GetMapping("/admin/getAllImages")
    public ResponseEntity<List<ImageDTO>> getAllImages() {
        List<ImageDTO> imageDTOs = imageService.getAllImages();
        return ResponseEntity.ok(imageDTOs);
    }
    @DeleteMapping("/admin/delete-image/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Integer imageId) {
        try {
            boolean deleted = imageService.deleteImageById(imageId);
            if (deleted) {
                return ResponseEntity.ok("Kép sikeresen törölve.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nem található kép a megadott ID-val.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Hiba történt a kép törlése közben.");
        }
    }

}
