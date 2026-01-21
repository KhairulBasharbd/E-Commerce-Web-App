package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.dto.req.ProductAdminRequest;
import com.ztrios.Ecommerce.dto.res.ProductResponse;
import com.ztrios.Ecommerce.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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

    @Operation(
            summary = "Create new product",
            description = "Admin creates a product",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = ProductAdminRequest.class),
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = """
                                               {
                                                 "name": "iPhone 15",
                                                 "description": "Latest Apple smartphone",
                                                 "price": 1200.50,
                                                 "stockQuantity": 50,
                                                 "category": "ELECTRONICS",
                                                 "active": true
                                               }
                                               """
                            )
                    )
            )
    )
    @PostMapping
    public ProductResponse create(@Valid @org.springframework.web.bind.annotation.RequestBody ProductAdminRequest request) {
        return adminService.createProduct(request);
    }

    @Operation(
            summary = "Update product",
            description = "Admin updates existing product by ID",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = ProductAdminRequest.class),
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = """
                                               {
                                                 "name": "iPhone 15 Pro",
                                                 "description": "Updated Apple smartphone",
                                                 "price": 1400.99,
                                                 "stockQuantity": 45,
                                                 "category": "ELECTRONICS",
                                                 "active": true
                                               }
                                               """
                            )
                    )
            )
    )
    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable UUID id,
                                  @Valid @org.springframework.web.bind.annotation.RequestBody ProductAdminRequest request) {
        return adminService.updateProduct(id, request);
    }
}
