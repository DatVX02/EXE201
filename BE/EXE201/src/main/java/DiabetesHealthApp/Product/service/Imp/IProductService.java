package DiabetesHealthApp.Product.service.Imp;

import DiabetesHealthApp.Product.DTO.ProductDTO;
import java.util.List;

public interface IProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(int id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(int id, ProductDTO productDTO);
    void deleteProduct(int id);
}
