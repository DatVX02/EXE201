package DiabetesHealthApp.Order.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter // ✅ Thêm @Setter ở đây
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Long orderId;

    @Column(name = "UserID", nullable = false)
    private Long userId;

    @Column(name = "OrderDate", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "TotalAmount", nullable = false)
    private Double totalAmount;

    @Column(name = "Status", length = 50, nullable = false)
    private String status;

    @PrePersist
    protected void onCreate() {
        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }
        if (totalAmount == null) {
            totalAmount = 0.0;
        }
    }

    // Constructors
    public Order() {}

    public Order(Long userId, LocalDateTime orderDate, Double totalAmount, String status) {
        this.userId = userId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }
}
