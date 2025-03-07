package DiabetesHealthApp.User.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UsersDTO {
    private Integer userID;
    private String account;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String status;
    private LocalDate dateOfBirth;
    private Integer roleID; // Chỉ lưu ID role
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
