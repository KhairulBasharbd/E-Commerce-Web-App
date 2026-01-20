package com.ztrios.Ecommerce.dto.res;


import java.util.UUID;

public record CartItemResponse(
        UUID productId,
        String name,
        Integer quantity,
        Double price
) {}