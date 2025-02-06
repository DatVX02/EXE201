package DiabetesHealthApp.Register.controller;

import DiabetesHealthApp.Register.model.LoginRequest;
import DiabetesHealthApp.Register.model.LoginResponse;
import DiabetesHealthApp.Register.model.Register;
import DiabetesHealthApp.Register.model.RegisterEntity;
import DiabetesHealthApp.Register.service.RegisterService;
import DiabetesHealthApp.Register.util.JwtUtil;
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
public class RegisterController {

    @Autowired
    private RegisterService registerService;

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
    public ResponseEntity<?> registerUser(@Valid @RequestBody Register register) {
        if (!register.getPassword().equals(register.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Password and Confirm Password do not match");
        }

        try {
            RegisterEntity savedUser = registerService.save(register);
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
        RegisterEntity authenticatedUser = registerService.authenticateAndGetUser(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (authenticatedUser != null) {
            // Tạo token JWT cho username
            String token = jwtUtil.generateToken(authenticatedUser.getUsername());

            // Tạo JWT cho password (sử dụng salt để tránh trùng token)
            String jwtPassword = jwtUtil.generateToken(authenticatedUser.getPassword() + "_salt");

            // Trả về thông tin LoginResponse
            LoginResponse response = new LoginResponse(
                    authenticatedUser.getUsername(),
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
    @GetMapping("/users")
    public ResponseEntity<List<RegisterEntity>> getAllUsers() {
        List<RegisterEntity> users = registerService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Tag(name = "User Management")
    @Operation(summary = "Get user by ID", description = "Fetch user details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return registerService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Tag(name = "User Management")
    @Operation(summary = "Update user by ID", description = "Update user details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody Register register) {
        try {
            RegisterEntity updatedUser = registerService.updateUser(id, register);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Tag(name = "User Management")
    @Operation(summary = "Delete user by ID", description = "Delete a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        boolean isDeleted = registerService.deleteUserById(id);
        if (isDeleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

}
