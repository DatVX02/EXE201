package DiabetesHealthApp.ProductDetail.Service.Imp;

import DiabetesHealthApp.ProductDetail.DTO.ProductDetailsDTO;
import java.util.List;

public interface IProductDetailsService {
    List<ProductDetailsDTO> getAllProducts();
    ProductDetailsDTO getProductById(Integer id);
    ProductDetailsDTO createProduct(ProductDetailsDTO productDetailsDTO);
    ProductDetailsDTO updateProduct(Integer id, ProductDetailsDTO productDetailsDTO);
    void deleteProduct(Integer id);
}
