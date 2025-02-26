package DiabetesHealthApp.Category.controller;

import DiabetesHealthApp.Category.model.Categories;
import DiabetesHealthApp.Category.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Categories> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categories> getCategoryById(@PathVariable int id) {
        Optional<Categories> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Categories createCategory(@RequestBody Categories category) {
        return categoryService.createCategory(category);
    }

    @PutMapping
    public ResponseEntity<Categories> updateCategory(@PathVariable int id, @RequestBody Categories category) {
        Categories updatedCategory = categoryService.updateCategory(id, category);
        return updatedCategory != null ? ResponseEntity.ok(updatedCategory) : ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCategory(@PathVariable int id) {
        return categoryService.deleteCategory(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

