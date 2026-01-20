package com.ztrios.Ecommerce.service.impl;

import com.ztrios.Ecommerce.dto.req.ProductAdminRequest;
import com.ztrios.Ecommerce.dto.res.ProductResponse;
import com.ztrios.Ecommerce.entity.Product;
import com.ztrios.Ecommerce.exception.custom.NotFoundException;
import com.ztrios.Ecommerce.mapper.ProductMapper;
import com.ztrios.Ecommerce.repository.ProductRepository;
import com.ztrios.Ecommerce.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    private final ProductRepository repository;

    public AdminServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductResponse createProduct(ProductAdminRequest request) {
        Product p = new Product();
        p.setName(request.name());
        p.setDescription(request.description());
        p.setPrice(request.price());
        p.setStockQuantity(request.stockQuantity());
        p.setCategory(request.category());
        p.setActive(request.active());
        repository.save(p);
        return ProductMapper.toResponse(p);
    }

    @Override
    public ProductResponse updateProduct(UUID id, ProductAdminRequest request) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        p.setName(request.name());
        p.setDescription(request.description());
        p.setPrice(request.price());
        p.setStockQuantity(request.stockQuantity());
        p.setCategory(request.category());
        p.setActive(request.active());
        repository.save(p);
        return ProductMapper.toResponse(p);
    }
}
