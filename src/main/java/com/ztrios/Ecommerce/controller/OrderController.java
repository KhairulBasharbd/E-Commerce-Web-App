package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.dto.res.OrderResponse;
import com.ztrios.Ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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

    @Operation(
            summary = "Place order from cart",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Order placed successfully"),
                    @ApiResponse(responseCode = "400", description = "Cart is empty or insufficient stock")
            }
    )
    @PostMapping
    public OrderResponse placeOrder(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return orderService.placeOrder(userId);
    }
}

