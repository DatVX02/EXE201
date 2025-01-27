package Register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    @Autowired
    private RegisterService registerService;

    // API Đăng ký tài khoản
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody Register register) {
        if (!register.getPassword().equals(register.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Password and Confirm Password do not match");
        }

        RegisterEntity savedUser = registerService.save(register);
        return ResponseEntity.ok(savedUser);
    }
    // API Đăng nhập tài khoản
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        LoginRespone authenticatedUser = registerService.authenticateAndGetUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
}
