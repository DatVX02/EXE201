package Register.service;

import Register.model.Register;
import Register.model.RegisterEntity;
import Register.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegisterService {

    @Autowired
    private RegisterRepository registerRepository;

    // Lưu thông tin người dùng
    public RegisterEntity save(Register register) {
        // Kiểm tra username trùng lặp
        Optional<RegisterEntity> existingUser = registerRepository.findByUsername(register.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }

        // Kiểm tra email trùng lặp
        Optional<RegisterEntity> existingEmail = registerRepository.findByEmail(register.getEmail());
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }

        // Tạo thực thể RegisterEntity từ thông tin người dùng
        RegisterEntity entity = new RegisterEntity();
        entity.setUsername(register.getUsername());
        entity.setPassword(register.getPassword()); // Có thể mã hóa mật khẩu tại đây
        entity.setRole(register.getRole());
        entity.setPhoneNumber(register.getPhoneNumber());
        entity.setEmail(register.getEmail());

        // Lưu vào database
        return registerRepository.save(entity);
    }

    // Xác thực người dùng
    public RegisterEntity authenticateAndGetUser(String username, String password) {
        // Tìm người dùng theo username
        Optional<RegisterEntity> user = registerRepository.findByUsername(username);

        // Kiểm tra username và password
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get(); // Trả về thông tin người dùng nếu xác thực thành công
        }

        // Trả về null nếu xác thực thất bại
        return null;
    }

    // Lấy danh sách tất cả người dùng
    public List<RegisterEntity> getAllUsers() {
        return registerRepository.findAll(); // Sử dụng phương thức `findAll` từ JpaRepository
    }

    public Optional<RegisterEntity> getUserById(Long id) {
        return registerRepository.findById(id);
    }
    public RegisterEntity updateUser(Long id, Register register) {
        Optional<RegisterEntity> existingUser = registerRepository.findById(id);

        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        RegisterEntity user = existingUser.get();
        user.setUsername(register.getUsername());
        user.setEmail(register.getEmail());
        user.setRole(register.getRole());

        // Kiểm tra và cập nhật mật khẩu nếu có
        if (register.getPassword() != null && !register.getPassword().isEmpty()) {
            if (!register.getPassword().equals(register.getConfirmPassword())) {
                throw new IllegalArgumentException("Password and Confirm Password do not match");
            }
            user.setPassword(register.getPassword());
        }

        return registerRepository.save(user);
    }

    public boolean deleteUserById(Long id) {
        Optional<RegisterEntity> user = registerRepository.findById(id);
        if (user.isPresent()) {
            registerRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
