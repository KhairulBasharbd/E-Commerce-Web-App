package com.ztrios.Ecommerce.mapper;


import com.ztrios.Ecommerce.dto.res.ProductResponse;
import com.ztrios.Ecommerce.entity.Product;

public final class ProductMapper {

    private ProductMapper() {}

    public static ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCategory(),
                product.isActive(),
                product.getCreatedAt()
        );
    }
}

