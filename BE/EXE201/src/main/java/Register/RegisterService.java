package Register;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisterService {

    @Autowired
    private RegisterRepository registerRepository;

    public RegisterEntity save(Register register) {
        // Kiểm tra username trùng lặp
        Optional<RegisterEntity> existingUser = registerRepository.findByUsername(register.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }

        // Kiểm tra độ dài mật khẩu
        if (register.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }

        RegisterEntity entity = new RegisterEntity();
        entity.setUsername(register.getUsername());
        entity.setPassword(register.getPassword());
        entity.setRole(register.getRole());
        entity.setPhoneNumber(register.getPhoneNumber());
        return registerRepository.save(entity);
    }

    public LoginRespone authenticateAndGetUser(String username, String password) {
        Optional<RegisterEntity> user = registerRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            RegisterEntity entity = user.get();
            return new LoginRespone(entity.getId(), entity.getUsername(), entity.getPassword(), entity.getRole());
        }
        return null; // Trả về null nếu không xác thực được
    }
}
