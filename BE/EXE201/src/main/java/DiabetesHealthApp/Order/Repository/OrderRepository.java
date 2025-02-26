package DiabetesHealthApp.Order.Repository;

import DiabetesHealthApp.Order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}