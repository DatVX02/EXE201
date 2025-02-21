package DiabetesHealthApp.User.model;

public class LoginResponse {
    private String account;
    private String password; // Mã hóa dạng JWT
    private String role;
    private String token;

    public LoginResponse(String account, String password, Role role, String token) {
        this.account = account;
        this.password = password;
        this.role = String.valueOf(role);
        this.token = token;
    }

    // Getters và Setters
    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
