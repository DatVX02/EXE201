package DiabetesHealthApp.User.service.Imp;

import DiabetesHealthApp.User.DTO.UsersDTO;
import java.util.List;

public interface IUsersService {
    UsersDTO getUserById(Long id);

    UsersDTO getUserById(Integer id);

    List<UsersDTO> getAllUsers();

    UsersDTO updateUser(Integer id, UsersDTO usersDTO);

    void deleteUser(Integer id);

    UsersDTO updateUser(Long id, UsersDTO usersDTO);
    void deleteUser(Long id);
}
