package DiabetesHealthApp.Product.model;

import DiabetesHealthApp.Category.model.Categories;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "products")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productID;

    @Column(nullable = false)
    private String name;

    private String shortDescription;

    @Column(nullable = false)
    private BigDecimal price;

    private String image;


    @ManyToOne
    @JoinColumn(name = "categoryID", nullable = false)
    private Categories category;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();


}
