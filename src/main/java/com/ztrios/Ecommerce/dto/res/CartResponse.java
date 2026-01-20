package com.ztrios.Ecommerce.dto.res;

import java.util.List;
import java.util.UUID;


public record CartResponse(
        UUID id,
        UUID userId,
        List<CartItemResponse> items
) {}