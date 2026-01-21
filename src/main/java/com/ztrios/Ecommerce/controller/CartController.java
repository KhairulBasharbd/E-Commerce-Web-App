package com.ztrios.Ecommerce.controller;



import com.ztrios.Ecommerce.dto.req.CartItemRequest;
import com.ztrios.Ecommerce.dto.res.CartResponse;
import com.ztrios.Ecommerce.security.CustomUserDetails;
import com.ztrios.Ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @Operation(summary = "View user's cart")
    @GetMapping
    public CartResponse viewCart(Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getId();

        return cartService.getCart(userId);
    }

    @Operation(
            summary = "Add item to cart",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CartItemRequest.class),
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = """
                                               {
                                                 "productId": "11111111-1111-1111-1111-111111111111",
                                                 "quantity": 2
                                               }
                                               """
                            )
                    )
            )
    )
    @PostMapping("/items")
    public CartResponse addItem(@Valid @org.springframework.web.bind.annotation.RequestBody CartItemRequest request, Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getId();
        return cartService.addItem(userId, request);
    }

    @Operation(
            summary = "Update item quantity in cart",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CartItemRequest.class),
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = """
                                               {
                                                 "productId": "11111111-1111-1111-1111-111111111111",
                                                 "quantity": 5
                                               }
                                               """
                            )
                    )
            )
    )
    @PutMapping("/items")
    public CartResponse updateItem(@Valid @org.springframework.web.bind.annotation.RequestBody CartItemRequest request, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getId();
        return cartService.updateItem(userId, request);
    }

    @Operation(summary = "Remove item from cart")
    @DeleteMapping("/items/{productId}")
    public CartResponse removeItem(@PathVariable UUID productId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getId();

        return cartService.removeItem(userId, productId);
    }
}
