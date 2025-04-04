package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.dto.LoginRequestDTO;
import com.casino.UserManagementSystem.dto.RegisterRequestDTO;
import com.casino.UserManagementSystem.dto.ReqRes;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.entity.Wallet;
import com.casino.UserManagementSystem.repository.TransactionRepo;
import com.casino.UserManagementSystem.repository.UsersRepo;
import com.casino.UserManagementSystem.repository.WalletRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private WalletRepo walletRepo;
    @Autowired
    private TransactionRepo transactionRepo;

    public ReqRes register(RegisterRequestDTO registrationRequest) {
        ReqRes resp = new ReqRes();
        try {
            OurUsers ourUsers = new OurUsers();
            ourUsers.setUsername(registrationRequest.getUsername());
            ourUsers.setEmail(registrationRequest.getEmail());
            ourUsers.setBirthDate(registrationRequest.getBirthDate());
            ourUsers.setRole(registrationRequest.getRole());
            ourUsers.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            // Ha admin a felhasználó, automatikusan igaz lesz az acceptedAgeVerification mező
            if ("ADMIN".equals(registrationRequest.getRole())) {
                ourUsers.setAcceptedAgeVerification(true);
            } else {
                ourUsers.setAcceptedAgeVerification(false); // Ha nem admin, akkor elvárjuk, hogy a mezőt tartalmazza
            }

            ourUsers = usersRepo.save(ourUsers);

            if (ourUsers.getId() > 0) {
                // Új wallet létrehozása a regisztráció során
                Wallet wallet = new Wallet();
                wallet.setUser(ourUsers);
                wallet.setBalance(BigDecimal.ZERO);
                wallet.setLastUpdated(LocalDateTime.now());
                walletRepo.save(wallet);

                resp.setOurUsers(ourUsers);
                resp.setMessage("User registered successfully with wallet");
                resp.setStatusCode(200);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes login(LoginRequestDTO loginRequest) {
        ReqRes resp = new ReqRes();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()));
            var user = usersRepo.findByUsername(loginRequest.getUsername()).orElseThrow();

            // Ellenőrizzük, hogy a felhasználó elfogadta-e az életkor-ellenőrzést
            if (!user.isAcceptedAgeVerification() && !"ADMIN".equals(user.getRole())) {
                resp.setStatusCode(403); // Forbidden
                resp.setMessage("You must accept the age verification to log in.");
                return resp;
            }

            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            resp.setStatusCode(200);
            resp.setToken(jwt);
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("Successfully logged in");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }
    // Accept Age Verification for a user
    public ReqRes acceptAgeVerification(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers user = userOptional.get();

                // Set acceptedAgeVerification to true for the user
                user.setAcceptedAgeVerification(true);
                usersRepo.save(user);

                reqRes.setStatusCode(200);
                reqRes.setMessage("Age verification accepted for user with ID: " + userId);
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for accepting age verification");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while accepting age verification: " + e.getMessage());
        }
        return reqRes;
    }

    public Optional<OurUsers> getUserByUsername(String username) {
        return usersRepo.findByUsername(username); // A repository metódus keresése username alapján
    }


    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();
        try{
            String ourUserName = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            OurUsers users = usersRepo.findByUsername(ourUserName).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }
    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }
    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }
    @Transactional
    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                // Először töröljük a felhasználóhoz tartozó walletet
                walletRepo.deleteByUserId(userId);


                transactionRepo.deleteByUserId(userId);
                // Most már törölhetjük a felhasználót
                usersRepo.deleteById(userId);

                reqRes.setStatusCode(200);
                reqRes.setMessage("User and related data deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setUsername(updatedUser.getUsername());
                existingUser.setBirthDate(updatedUser.getBirthDate());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }
    public ReqRes getMyInfo(String username) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByUsername(username);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }

    public void updateUserPassword(OurUsers user) {
        Optional<OurUsers> existingUser = usersRepo.findById(user.getId());
        if (existingUser.isPresent()) {
            OurUsers updatedUser = existingUser.get();
            updatedUser.setPassword(user.getPassword()); // Csak a jelszó frissítése
            usersRepo.save(updatedUser);
        }
    }
    public void updateUserProfile(OurUsers user) {
        Optional<OurUsers> existingUser = usersRepo.findById(user.getId());
        if (existingUser.isPresent()) {
            OurUsers updatedUser = existingUser.get();

            updatedUser.setUsername(user.getUsername());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setBirthDate(user.getBirthDate());

            usersRepo.save(updatedUser);
        }
    }




}
