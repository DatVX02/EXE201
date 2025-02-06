//package DiabetesHealthApp.Register;
//
////import org.springframework.boot.SpringApplication;
////import org.springframework.boot.autoconfigure.SpringBootApplication;
////import org.springframework.context.annotation.ComponentScan;
////
////@SpringBootApplication
////@ComponentScan(basePackages = "") // Quét tất cả các lớp trong package "Register"
//import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
//import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
//import io.swagger.v3.oas.annotations.security.SecurityScheme;
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.scheduling.annotation.EnableAsync;
//import org.springframework.scheduling.annotation.EnableScheduling;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//
//import javax.annotation.PostConstruct;
//import java.util.TimeZone;
//
//@SpringBootApplication
//@SecurityScheme(name = "api", scheme = "bearer", type = SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER)
//@EnableAsync
//@EnableWebMvc
//@EnableScheduling
//public class Registerapp {
//    public static void main(String[] args) {
//        SpringApplication.run(Registerapp.class, args);
//    }
//    @PostConstruct
//    public void init() {
//        TimeZone.setDefault(TimeZone.getTimeZone("UTC+7:00"));
//    }
//}
