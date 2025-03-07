package DiabetesHealthApp.User.model;

public class RegisterResponse {
    private Long id;
    private String account;
    private String role;

    // Constructor
    public RegisterResponse(Long id, String account, String role) {
        this.id = id;
        this.account = account;
        this.role = role;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
