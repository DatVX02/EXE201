package DiabetesHealthApp.ProductDetail.Controller;

import DiabetesHealthApp.ProductDetail.DTO.ProductDetailsDTO;
import DiabetesHealthApp.ProductDetail.Service.Imp.IProductDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productsdetails")
public class ProductDetailController {

    @Autowired
    private IProductDetailsService productDetailsService;

    @GetMapping
    public ResponseEntity<List<ProductDetailsDTO>> getAllProducts() {
        return ResponseEntity.ok(productDetailsService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsDTO> getProductById(@PathVariable int id) {
        return ResponseEntity.ok(productDetailsService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDetailsDTO> createProduct(@RequestBody ProductDetailsDTO productDetailsDTO) {
        return ResponseEntity.ok(productDetailsService.createProduct(productDetailsDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailsDTO> updateProduct(@PathVariable int id, @RequestBody ProductDetailsDTO productDetailsDTO) {
        return ResponseEntity.ok(productDetailsService.updateProduct(id, productDetailsDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        productDetailsService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
