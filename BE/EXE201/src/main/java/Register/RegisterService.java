package Register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisterService {

    @Autowired
    private RegisterRepository registerRepository;

    public RegisterEntity save(Register register) {
        // Kiểm tra trùng lặp username
        Optional<RegisterEntity> existingUser = registerRepository.findByUsername(register.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }

        // Kiểm tra trùng lặp email
        Optional<RegisterEntity> existingEmail = registerRepository.findByEmail(register.getEmail());
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }

        RegisterEntity entity = new RegisterEntity();
        entity.setUsername(register.getUsername());
        entity.setPassword(register.getPassword()); // Mã hóa mật khẩu nếu cần
        entity.setRole(register.getRole());
        entity.setPhoneNumber(register.getPhoneNumber());
        entity.setEmail(register.getEmail());
        return registerRepository.save(entity);
    }

    public boolean authenticate(String username, String password) {
        Optional<RegisterEntity> user = registerRepository.findByUsername(username);
        return user.isPresent() && user.get().getPassword().equals(password);
    }
}
