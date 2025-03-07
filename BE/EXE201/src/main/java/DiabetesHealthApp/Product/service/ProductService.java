package DiabetesHealthApp.Product.service;

import DiabetesHealthApp.Category.model.Categories;
import DiabetesHealthApp.Product.DTO.ProductDTO;
import DiabetesHealthApp.Product.model.Products;
import DiabetesHealthApp.Product.repository.ProductRepository;
import DiabetesHealthApp.Category.repository.CategoryRepository;
import DiabetesHealthApp.Product.service.Imp.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Products> products = productRepository.findAll();
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(int id) {
        Products product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Products product = convertToEntity(productDTO);
        product = productRepository.save(product);
        return convertToDTO(product);
    }

    @Override
    public ProductDTO updateProduct(int id, ProductDTO productDTO) {
        Products existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(productDTO.getName());
        existingProduct.setShortDescription(productDTO.getShortDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setImage(productDTO.getImage());

        Categories category = categoryRepository.findById(productDTO.getCategoryID())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingProduct.setCategory(category);

        Products updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }

    private ProductDTO convertToDTO(Products product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductID(product.getProductID());
        dto.setName(product.getName());
        dto.setShortDescription(product.getShortDescription());
        dto.setPrice(product.getPrice());
        dto.setImage(product.getImage());
        dto.setCategoryID(product.getCategory().getCategoryID());
        return dto;
    }

    private Products convertToEntity(ProductDTO productDTO) {
        Products product = new Products();
        product.setName(productDTO.getName());
        product.setShortDescription(productDTO.getShortDescription());
        product.setPrice(productDTO.getPrice());
        product.setImage(productDTO.getImage());

        Categories category = categoryRepository.findById(productDTO.getCategoryID())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        return product;
    }
}
