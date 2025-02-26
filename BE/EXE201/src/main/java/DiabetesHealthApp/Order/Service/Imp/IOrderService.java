package DiabetesHealthApp.Order.Service.Imp;

import DiabetesHealthApp.Order.DTO.OrderDTO;
import DiabetesHealthApp.Order.model.Order;
import java.util.List;
import java.util.Optional;

public interface IOrderService {
    Order createOrder(OrderDTO orderDTO);
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Integer id);
    Order updateOrder(Integer id, OrderDTO orderDTO);
    void deleteOrder(Integer id);
}