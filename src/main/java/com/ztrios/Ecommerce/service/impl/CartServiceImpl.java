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

    // ===================== GET CART =====================
    @Override
    public CartResponse getCart(UUID userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Item not found in cart"));

        if (cart == null) {
            // return EMPTY cart, do not create DB row
            return new CartResponse(null, userId, List.of());
        }

        return mapCart(cart);
    }

    // ===================== ADD ITEM =====================
    @Override
    public CartResponse addItem(UUID userId, CartItemRequest request) {

        User user = getUser(userId);
        Product product = getProduct(request.productId());

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst()
                .ifPresentOrElse(
                        i -> i.setQuantity(i.getQuantity() + request.quantity()),
                        () -> cart.addItem(new CartItem(product, request.quantity()))
                );

        cartRepository.save(cart);
        return mapCart(cart);
    }

    // ===================== UPDATE ITEM =====================
    @Override
    public CartResponse updateItem(UUID userId, CartItemRequest request) {

        Cart cart = getExistingCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.productId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Item not found in cart"));

        item.setQuantity(request.quantity());

        cartRepository.save(cart);
        return mapCart(cart);
    }

    // ===================== REMOVE ITEM =====================
    @Override
    public CartResponse removeItem(UUID userId, UUID productId) {

        Cart cart = getExistingCart(userId);

        boolean removed = cart.getItems()
                .removeIf(i -> i.getProduct().getId().equals(productId));

        if (!removed) {
            throw new NotFoundException("Item not found in cart");
        }

        // optional cleanup
        if (cart.getItems().isEmpty()) {
            cartRepository.delete(cart);
            return new CartResponse(null, userId, List.of());
        }

        cartRepository.save(cart);
        return mapCart(cart);
    }

    // ===================== HELPERS =====================
    private Cart getExistingCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Cart does not exist"));
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private Product getProduct(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    private CartResponse mapCart(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(i -> new CartItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getProduct().getPrice()
                ))
                .toList();

        return new CartResponse(cart.getId(), cart.getUser().getId(), items);
    }
}
