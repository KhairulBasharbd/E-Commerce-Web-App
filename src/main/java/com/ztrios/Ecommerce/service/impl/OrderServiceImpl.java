package com.ztrios.Ecommerce.service.impl;


import com.ztrios.Ecommerce.dto.res.OrderItemResponse;
import com.ztrios.Ecommerce.dto.res.OrderResponse;
import com.ztrios.Ecommerce.entity.Cart;
import com.ztrios.Ecommerce.entity.Order;
import com.ztrios.Ecommerce.entity.OrderItem;
import com.ztrios.Ecommerce.entity.User;
import com.ztrios.Ecommerce.exception.custom.NotFoundException;
import com.ztrios.Ecommerce.repository.CartRepository;
import com.ztrios.Ecommerce.repository.OrderRepository;
import com.ztrios.Ecommerce.repository.ProductRepository;
import com.ztrios.Ecommerce.repository.UserRepository;
import com.ztrios.Ecommerce.service.OrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(UserRepository userRepository,
                            CartRepository cartRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public OrderResponse placeOrder(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Cart is empty"));

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(i -> {
                    var product = i.getProduct();
                    if (product.getStockQuantity() < i.getQuantity())
                        throw new NotFoundException("Insufficient stock for " + product.getName());
                    productRepository.save(product); // Reduce stock if needed
                    return new OrderItem(product, i.getQuantity(), product.getPrice());
                }).toList();

        BigDecimal totalPrice = orderItems.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order(user, orderItems, totalPrice);
        orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        List<OrderItemResponse> itemsResp = orderItems.stream()
                .map(i -> new OrderItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getPrice()
                ))
                .toList();

        return new OrderResponse(order.getId(), userId, itemsResp, totalPrice, order.getStatus().name());
    }
}
