package com.ztrios.Ecommerce.service;

import com.ztrios.Ecommerce.dto.res.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.UUID;

public interface ProductService {
    Page<ProductResponse> getProducts(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String category,
            String name,
            Boolean active,
            Pageable pageable
    );

    ProductResponse getById(UUID id);
}

