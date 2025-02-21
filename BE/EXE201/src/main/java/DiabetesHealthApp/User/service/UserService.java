package DiabetesHealthApp.User.service;

import DiabetesHealthApp.User.model.RegisterRequest;
import DiabetesHealthApp.User.model.Users;
import DiabetesHealthApp.User.repository.RoleRepository;
import DiabetesHealthApp.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DiabetesHealthApp.User.model.Role;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Lưu thông tin người dùng
    public Users save(RegisterRequest registerRequest) {
        // Kiểm tra account trùng lặp
        Optional<Users> existingUser = userRepository.findByAccount(registerRequest.getAccount());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Account already exists!");
        }

        // Kiểm tra email trùng lặp
        Optional<Users> existingEmail = userRepository.findByEmail(registerRequest.getEmail());
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }

        // Kiểm tra mật khẩu có khớp không
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match");
        }

        // Tạo thực thể User từ thông tin người dùng
        Users entity = new Users();
        entity.setAccount(registerRequest.getAccount());
        entity.setFullName(registerRequest.getFullname());
        entity.setEmail(registerRequest.getEmail());
        entity.setPassword(registerRequest.getPassword()); // Có thể mã hóa mật khẩu tại đây

        // Gán role mặc định là "User"
        Role defaultRole = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new IllegalArgumentException("Default role 'USER' not found"));
        entity.setRole(defaultRole);

        entity.setStatus("ACTIVE");

        // Lưu vào database
        return userRepository.save(entity);
    }

    // Xác thực người dùng
    public Users authenticateAndGetUser(String account, String password) {
        // Tìm người dùng theo account
        Optional<Users> user = userRepository.findByAccount(account);

        // Kiểm tra account và password
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get(); // Trả về thông tin người dùng nếu xác thực thành công
        }

        // Trả về null nếu xác thực thất bại
        return null;
    }

    // Lấy danh sách tất cả người dùng
    public List<Users> getAllUsers() {
        return userRepository.findAll(); // Sử dụng phương thức `findAll` từ JpaRepository
    }

    public Optional<Users> getUserById(long id) {
        return userRepository.findById(id);
    }

    public Users updateUser(long id, RegisterRequest registerRequest) {
        Optional<Users> existingUser = userRepository.findById(id);

        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        Users user = existingUser.get();
        user.setAccount(registerRequest.getAccount());
        user.setEmail(registerRequest.getEmail());
        user.setRole(registerRequest.getRole());

        // Kiểm tra và cập nhật mật khẩu nếu có
        if (registerRequest.getPassword() != null && !registerRequest.getPassword().isEmpty()) {
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                throw new IllegalArgumentException("Password and Confirm Password do not match");
            }
            user.setPassword(registerRequest.getPassword());
        }

        return userRepository.save(user);
    }

    public boolean deleteUserById(long id) {
        Optional<Users> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
