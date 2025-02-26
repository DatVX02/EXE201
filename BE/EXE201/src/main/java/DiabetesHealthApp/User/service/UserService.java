package DiabetesHealthApp.User.service;

import DiabetesHealthApp.User.DTO.UsersDTO;
import DiabetesHealthApp.User.model.RegisterRequest;
import DiabetesHealthApp.User.model.Users;
import DiabetesHealthApp.User.repository.RoleRepository;
import DiabetesHealthApp.User.repository.UserRepository;
import DiabetesHealthApp.User.service.Imp.IUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DiabetesHealthApp.User.model.Role;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements IUsersService {

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

    @Override
    public UsersDTO getUserById(Long id) {
        Optional<Users> userOptional = userRepository.findById(id);
        return userOptional.map(this::mapToDTO).orElse(null);
    }

    @Override
    public UsersDTO getUserById(Integer id) {
        return null;
    }

    @Override
    public List<UsersDTO> getAllUsers() {
        List<Users> usersList = userRepository.findAll();
        return usersList.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public UsersDTO updateUser(Integer id, UsersDTO usersDTO) {
        return null;
    }

    @Override
    public void deleteUser(Integer id) {

    }

    @Override
    public UsersDTO updateUser(Long id, UsersDTO usersDTO) {
        Optional<Users> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            user.setAccount(usersDTO.getAccount());
            user.setEmail(usersDTO.getEmail());
            user.setFullName(usersDTO.getFullName());
            user.setPhoneNumber(usersDTO.getPhoneNumber());
            user.setStatus(usersDTO.getStatus());
            user.setDateOfBirth(usersDTO.getDateOfBirth());

            Role role = new Role();
            role.setRoleID(usersDTO.getRoleID());
            user.setRole(role);

            Users updatedUser = userRepository.save(user);
            return mapToDTO(updatedUser);
        }
        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UsersDTO mapToDTO(Users user) {
        UsersDTO dto = new UsersDTO();
        dto.setUserID(user.getUserID());
        dto.setAccount(user.getAccount());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setStatus(user.getStatus());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setRoleID(user.getRole().getRoleID());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
