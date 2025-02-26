package DiabetesHealthApp.ProductDetail.Repository;

import DiabetesHealthApp.ProductDetail.model.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailsRepository extends JpaRepository<ProductDetail, Integer> {
}