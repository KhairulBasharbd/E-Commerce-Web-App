package com.ztrios.Ecommerce.service;

import com.ztrios.Ecommerce.dto.req.ProductAdminRequest;
import com.ztrios.Ecommerce.dto.res.ProductResponse;

import java.util.UUID;

public interface AdminService {
    ProductResponse createProduct(ProductAdminRequest request);
    ProductResponse updateProduct(UUID id, ProductAdminRequest request);
}
