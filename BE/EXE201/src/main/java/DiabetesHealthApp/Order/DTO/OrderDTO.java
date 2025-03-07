package DiabetesHealthApp.Order.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long userId;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private String status;
}