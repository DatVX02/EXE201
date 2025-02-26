package DiabetesHealthApp.ProductDetail.DTO;

import lombok.Data;

@Data
public class ProductDetailsDTO {
    private Long productDetailID;
    private Long productID;
    private String description;
    private Double price;
    private String image;
    private Long categoryID;
    private Integer stock;
}
