package Register;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "Register") // Quét tất cả các lớp trong package "Register"
public class Registerapp {
    public static void main(String[] args) {
        SpringApplication.run(Registerapp.class, args);
    }
}
