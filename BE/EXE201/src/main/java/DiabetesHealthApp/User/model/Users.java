package DiabetesHealthApp.User.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(nullable = false, unique = true, length = 20)
    private String account;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 20)
    private String password;

    @Column(length = 255)
    private String gender;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "roleID")
    private Role role;

    private LocalDate dateOfBirth;

    @Column(length = 255)
    @NotBlank(message = "Full name must not be blank")
    private String fullName;

    @Column(length = 255)
    private String phoneNumber;

    @Column(length = 255, columnDefinition = "VARCHAR(255) DEFAULT 'ACTIVE'")
    private String status = "ACTIVE";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
