package Register.service;

import Register.model.Register;
import Register.model.RegisterEntity;
import Register.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisterService {

    @Autowired
    private RegisterRepository registerRepository;

    public RegisterEntity save(Register register) {
        // Kiểm tra username đã tồn tại
        Optional<RegisterEntity> existingUser = registerRepository.findByUsername(register.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }

        // Kiểm tra email đã tồn tại
        Optional<RegisterEntity> existingEmail = registerRepository.findByEmail(register.getEmail());
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }

        // Tạo đối tượng RegisterEntity
        RegisterEntity entity = new RegisterEntity();
        entity.setUsername(register.getUsername());
        entity.setPassword(register.getPassword()); // Bạn có thể mã hóa mật khẩu tại đây
        entity.setRole(register.getRole());
        entity.setPhoneNumber(register.getPhoneNumber());
        entity.setEmail(register.getEmail());

        // Lưu vào cơ sở dữ liệu
        return registerRepository.save(entity);
    }

    public RegisterEntity authenticateAndGetUser(String username, String password) {
        Optional<RegisterEntity> user = registerRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        return null;
    }
}
