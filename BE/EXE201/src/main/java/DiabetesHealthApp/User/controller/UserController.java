package DiabetesHealthApp.User.controller;

import DiabetesHealthApp.User.DTO.UsersDTO;
import DiabetesHealthApp.User.model.*;
import DiabetesHealthApp.User.service.Imp.IUsersService;
import DiabetesHealthApp.User.service.UserService;
import DiabetesHealthApp.User.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private IUsersService usersService;

    @Autowired
    private JwtUtil jwtUtil;

    // ====================== AUTHENTICATION ======================
    @Tag(name = "Authentication", description = "")
    @Operation(summary = "User registration", description = "API for user registration")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error or username already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Password and Confirm Password do not match");
        }

        try {
            Users savedUser = userService.save(registerRequest);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Tag(name = "Authentication")
    @Operation(summary = "User login", description = "API for user login")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Invalid username or password")
    })
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Users authenticatedUser = userService.authenticateAndGetUser(
                loginRequest.getAccount(),
                loginRequest.getPassword()
        );

        if (authenticatedUser != null) {
            // Tạo token JWT cho username
            String token = jwtUtil.generateToken(authenticatedUser.getAccount());

            // Tạo JWT cho password (sử dụng salt để tránh trùng token)
            String jwtPassword = jwtUtil.generateToken(authenticatedUser.getPassword() + "_salt");

            // Trả về thông tin LoginResponse
            LoginResponse response = new LoginResponse(
                    authenticatedUser.getAccount(),
                    jwtPassword,
                    authenticatedUser.getRole(),
                    token
            );

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }

    // ====================== USER MANAGEMENT ======================
    @Tag(name = "User Management", description = "")
    @Operation(summary = "Get all users", description = "Fetch all registered users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched all users successfully"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @GetMapping("/GetAllUser")
    public ResponseEntity<List<UsersDTO>> getAllUsers() {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @Tag(name = "User Management")
    @Operation(summary = "Get user by ID", description = "Fetch user details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/GetUserById")
    public ResponseEntity<UsersDTO> getUserById(@PathVariable long id) {
        UsersDTO userDTO = usersService.getUserById(id);
        return userDTO != null ? ResponseEntity.ok(userDTO) : ResponseEntity.notFound().build();
    }

    @Tag(name = "User Management")
    @Operation(summary = "Update user by ID", description = "Update user details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/UpdateUser")
    public ResponseEntity<UsersDTO> updateUser(@PathVariable long id, @RequestBody UsersDTO usersDTO) {
        UsersDTO updatedUser = usersService.updateUser(id, usersDTO);
        return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
    }

    @Tag(name = "User Management")
    @Operation(summary = "Delete user by ID", description = "Delete a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/DeleteUser")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
