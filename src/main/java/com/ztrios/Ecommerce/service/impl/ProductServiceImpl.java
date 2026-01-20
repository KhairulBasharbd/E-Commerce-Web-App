package com.ztrios.Ecommerce.service.impl;

import com.ztrios.Ecommerce.dto.res.ProductResponse;
import com.ztrios.Ecommerce.entity.Product;
import com.ztrios.Ecommerce.exception.custom.NotFoundException;
import com.ztrios.Ecommerce.mapper.ProductMapper;
import com.ztrios.Ecommerce.repository.ProductRepository;
import com.ztrios.Ecommerce.service.ProductService;
import com.ztrios.Ecommerce.specification.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;

    public ProductServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<ProductResponse> getProducts(BigDecimal minPrice,
                                             BigDecimal maxPrice,
                                             String category,
                                             String name,
                                             Boolean active,
                                             Pageable pageable) {

        Specification<Product> spec = Specification
                .where(ProductSpecification.minPrice(minPrice))
                .and(ProductSpecification.maxPrice(maxPrice))
                .and(ProductSpecification.category(category))
                .and(ProductSpecification.nameContains(name))
                .and(ProductSpecification.active(active));

        return repository.findAll(spec, pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    public ProductResponse getById(UUID id) {
        return repository.findById(id)
                .map(ProductMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }
}

