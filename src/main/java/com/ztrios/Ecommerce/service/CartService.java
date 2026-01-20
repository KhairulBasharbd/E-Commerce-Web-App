package com.ztrios.Ecommerce.service;


import com.ztrios.Ecommerce.dto.req.CartItemRequest;
import com.ztrios.Ecommerce.dto.res.CartResponse;

import java.util.UUID;

public interface CartService {
    CartResponse getCart(UUID userId);
    CartResponse addItem(UUID userId, CartItemRequest request);
    CartResponse updateItem(UUID userId, CartItemRequest request);
    CartResponse removeItem(UUID userId, UUID productId);
}