package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.dto.req.CartItemRequest;
import com.ztrios.Ecommerce.dto.res.CartResponse;
import com.ztrios.Ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse viewCart(Authentication authentication) {
        UUID userId = extractUserId(authentication);
        return cartService.getCart(userId);
    }

    @PostMapping("/items")
    public CartResponse addItem(@Valid @RequestBody CartItemRequest request,
                                Authentication authentication) {
        UUID userId = extractUserId(authentication);
        return cartService.addItem(userId, request);
    }

    @PutMapping("/items")
    public CartResponse updateItem(@Valid @RequestBody CartItemRequest request,
                                   Authentication authentication) {
        UUID userId = extractUserId(authentication);
        return cartService.updateItem(userId, request);
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse removeItem(@PathVariable UUID productId,
                                   Authentication authentication) {
        UUID userId = extractUserId(authentication);
        return cartService.removeItem(userId, productId);
    }

    private UUID extractUserId(Authentication authentication) {
        // email is stored as username
        // User lookup happens inside service layer
        return UUID.fromString(authentication.getName()); // see NOTE below
    }
}

