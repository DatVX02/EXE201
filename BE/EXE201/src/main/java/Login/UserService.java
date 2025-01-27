package Login;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    private final Map<String, String> userStore = new HashMap<>();

    public UserService() {
        // Thêm một số người dùng mẫu
        userStore.put("user1@example.com", "password123");
        userStore.put("admin@example.com", "admin123");
    }

    public User authenticateAndGetUser(String email, String password) {
        if (userStore.containsKey(email) && userStore.get(email).equals(password)) {
            return new User(email, password); // Trả về thông tin tài khoản
        }
        return null; // Trả về null nếu không xác thực được
    }
}
