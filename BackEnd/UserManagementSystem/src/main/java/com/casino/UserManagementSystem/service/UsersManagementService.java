package com.casino.UserManagementSystem.service;

import com.casino.UserManagementSystem.dto.ReqRes;
import com.casino.UserManagementSystem.entity.OurUsers;
import com.casino.UserManagementSystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public ReqRes register (ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();
        try {
            OurUsers ourUsers = new OurUsers();
            ourUsers.setUsername(registrationRequest.getUsername());
            ourUsers.setEmail(registrationRequest.getEmail());
            ourUsers.setBirthDate(registrationRequest.getBirthDate());
            ourUsers.setRole(registrationRequest.getRole());
            ourUsers.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUsers=usersRepo.save(ourUsers);
            if (ourUsers.getId()>0){
                resp.setOurUsers(ourUsers);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }


        }catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes login (ReqRes loginRequest) {
        ReqRes resp = new ReqRes();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()));
            var user = usersRepo.findByUsername(loginRequest.getUsername()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(),user);
            resp.setStatusCode(200);
            resp.setToken(jwt);
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("Successfully logged in");
        }catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
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
    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
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
}
