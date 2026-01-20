package com.ztrios.Ecommerce.controller;

import com.ztrios.Ecommerce.dto.req.ProductAdminRequest;
import com.ztrios.Ecommerce.dto.res.ProductResponse;
import com.ztrios.Ecommerce.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final AdminService adminService;

    public AdminProductController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    public ProductResponse create(@RequestBody @Valid ProductAdminRequest request) {
        return adminService.createProduct(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable UUID id,
                                  @RequestBody @Valid ProductAdminRequest request) {
        return adminService.updateProduct(id, request);
    }
}
