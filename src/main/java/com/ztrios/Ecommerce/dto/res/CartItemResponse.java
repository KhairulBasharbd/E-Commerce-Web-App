package com.ztrios.Ecommerce.dto.res;


import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.UUID;

public record CartItemResponse(
        UUID productId,
        String name,
        Integer quantity,
        BigDecimal price
) {}