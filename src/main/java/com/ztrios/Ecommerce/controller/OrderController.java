package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.dto.res.OrderResponse;
import com.ztrios.Ecommerce.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse placeOrder(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return orderService.placeOrder(userId);
    }
}

