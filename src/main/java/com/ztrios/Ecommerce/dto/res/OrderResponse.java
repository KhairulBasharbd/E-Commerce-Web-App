package com.ztrios.Ecommerce.dto.res;

import java.math.BigDecimal;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        UUID userId,
        List<OrderItemResponse> items,
        BigDecimal totalPrice,
        String status
) {}