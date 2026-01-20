package com.ztrios.Ecommerce.dto.res;

import java.math.BigDecimal;
import java.time.Instant;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String category,
        boolean active,
        Instant createdAt
) {}
