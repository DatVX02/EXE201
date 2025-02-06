package DiabetesHealthApp.Category.service;

import DiabetesHealthApp.Category.model.Categories;
import DiabetesHealthApp.Category.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Categories> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Categories> getCategoryById(int id) {
        return categoryRepository.findById(id);
    }

    public Categories createCategory(Categories category) {
        return categoryRepository.save(category);
    }

    public Categories updateCategory(int id, Categories categoryDetails) {
        if (categoryRepository.existsById(id)) {
            categoryDetails.setCategoryID(id);
            return categoryRepository.save(categoryDetails);
        }
        return null;
    }

    public boolean deleteCategory(int id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

