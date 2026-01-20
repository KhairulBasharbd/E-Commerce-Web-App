package com.ztrios.Ecommerce.service;


import com.ztrios.Ecommerce.dto.res.OrderResponse;

import java.util.UUID;

public interface OrderService {
    OrderResponse placeOrder(UUID userId);
}
