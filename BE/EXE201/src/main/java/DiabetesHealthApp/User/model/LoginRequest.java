package DiabetesHealthApp.User.model;

public class LoginRequest {
    private String account;
    private String password;

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
}
