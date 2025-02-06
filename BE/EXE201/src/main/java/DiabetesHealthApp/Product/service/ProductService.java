package DiabetesHealthApp.Product.service;

import DiabetesHealthApp.Product.model.Products;
import DiabetesHealthApp.Product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Products> getProductById(int id) {
        return productRepository.findById(id);
    }

    public Products createProduct(Products product) {
        return productRepository.save(product);
    }

    public Products updateProduct(int id, Products productDetails) {
        if (productRepository.existsById(id)) {
            productDetails.setProductID(id);
            return productRepository.save(productDetails);
        }
        return null;
    }

    public boolean deleteProduct(int id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
