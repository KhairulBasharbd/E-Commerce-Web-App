package com.ztrios.Ecommerce.dto.req;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductAdminRequest(
        @NotBlank String name,
        String description,
        @NotNull BigDecimal price,
        @NotNull Integer stockQuantity,
        @NotBlank String category,
        @NotNull Boolean active
) {}
