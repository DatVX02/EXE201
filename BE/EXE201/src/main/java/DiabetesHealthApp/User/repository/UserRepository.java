package DiabetesHealthApp.User.repository;

import DiabetesHealthApp.User.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByAccount(String username);

    Optional<Users> findByEmail(String email);
}