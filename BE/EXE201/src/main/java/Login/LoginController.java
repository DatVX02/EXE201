package Login;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody User user) {
        User authenticatedUser = userService.authenticateAndGetUser(user.getEmail(), user.getPassword());

        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser); // Trả về JSON của đối tượng User
        } else {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
    }
}
