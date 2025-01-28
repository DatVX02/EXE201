package Register.controller;

import Register.model.LoginRequest;
import Register.model.LoginResponse;
import Register.model.Register;
import Register.model.RegisterEntity;
import Register.service.RegisterService;
import Register.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Get all users", description = "Fetch all registered users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched all users successfully"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @GetMapping("/users")
    public ResponseEntity<List<RegisterEntity>> getAllUsers() {
        // Lấy danh sách người dùng từ service
        List<RegisterEntity> users = registerService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
