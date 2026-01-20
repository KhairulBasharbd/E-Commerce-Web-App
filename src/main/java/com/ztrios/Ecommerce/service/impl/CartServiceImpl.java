package com.ztrios.Ecommerce.service.impl;



import com.ztrios.Ecommerce.dto.req.CartItemRequest;
import com.ztrios.Ecommerce.dto.res.CartItemResponse;
import com.ztrios.Ecommerce.dto.res.CartResponse;
import com.ztrios.Ecommerce.entity.Cart;
import com.ztrios.Ecommerce.entity.CartItem;
import com.ztrios.Ecommerce.entity.Product;
import com.ztrios.Ecommerce.entity.User;
import com.ztrios.Ecommerce.exception.custom.NotFoundException;
import com.ztrios.Ecommerce.repository.CartRepository;
import com.ztrios.Ecommerce.repository.ProductRepository;
import com.ztrios.Ecommerce.repository.UserRepository;
import com.ztrios.Ecommerce.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public CartResponse getCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return mapCart(cart);
    }

    @Override
    public CartResponse addItem(UUID userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Product not found"));
        cart.addItem(new CartItem(product, request.quantity()));
        cartRepository.save(cart);
        return mapCart(cart);
    }

    @Override
    public CartResponse updateItem(UUID userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.productId()))
                .findFirst()
                .ifPresentOrElse(
                        i -> i.setQuantity(request.quantity()),
                        () -> cart.addItem(new CartItem(
                                productRepository.findById(request.productId())
                                        .orElseThrow(() -> new NotFoundException("Product not found")),
                                request.quantity()))
                );
        cartRepository.save(cart);
        return mapCart(cart);
    }

    @Override
    public CartResponse removeItem(UUID userId, UUID productId) {
        Cart cart = getOrCreateCart(userId);
        cart.removeItem(productId);
        cartRepository.save(cart);
        return mapCart(cart);
    }

    private Cart getOrCreateCart(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    private CartResponse mapCart(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(i -> new CartItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getProduct().getPrice().doubleValue()
                ))
                .collect(Collectors.toList());
        return new CartResponse(cart.getId(), cart.getUser().getId(), items);
    }
}
