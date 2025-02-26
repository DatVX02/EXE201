package DiabetesHealthApp.ProductDetail.Service;

import DiabetesHealthApp.ProductDetail.DTO.ProductDetailsDTO;
import DiabetesHealthApp.ProductDetail.model.ProductDetail;
import DiabetesHealthApp.ProductDetail.Repository.ProductDetailsRepository;
import DiabetesHealthApp.ProductDetail.Service.Imp.IProductDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductDetailsService implements IProductDetailsService {

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Override
    public List<ProductDetailsDTO> getAllProducts() {
        return productDetailsRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ProductDetailsDTO getProductById(Integer id) {
        ProductDetail product = productDetailsRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    @Override
    public ProductDetailsDTO createProduct(ProductDetailsDTO productDetailsDTO) {
        ProductDetail product = convertToEntity(productDetailsDTO);
        ProductDetail savedProduct = productDetailsRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    public ProductDetailsDTO updateProduct(Integer id, ProductDetailsDTO productDetailsDTO) {
        ProductDetail existingProduct = productDetailsRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setProductID(productDetailsDTO.getProductID());
        existingProduct.setDescription(productDetailsDTO.getDescription());
        existingProduct.setPrice(productDetailsDTO.getPrice());
        existingProduct.setImage(productDetailsDTO.getImage());
        existingProduct.setCategoryID(productDetailsDTO.getCategoryID());
        existingProduct.setStock(productDetailsDTO.getStock());

        ProductDetail updatedProduct = productDetailsRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Integer id) {
        productDetailsRepository.deleteById(id);
    }

    private ProductDetailsDTO convertToDTO(ProductDetail product) {
        ProductDetailsDTO dto = new ProductDetailsDTO();
        dto.setProductDetailID(product.getProductDetailID());
        dto.setProductID(product.getProductID());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImage(product.getImage());
        dto.setCategoryID(product.getCategoryID());
        dto.setStock(product.getStock());
        return dto;
    }

    private ProductDetail convertToEntity(ProductDetailsDTO dto) {
        ProductDetail product = new ProductDetail();
        product.setProductDetailID(dto.getProductDetailID());
        product.setProductID(dto.getProductID());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImage(dto.getImage());
        product.setCategoryID(dto.getCategoryID());
        product.setStock(dto.getStock());
        return product;
    }
}