package com.ztrios.Ecommerce.service.impl;


import com.ztrios.Ecommerce.dto.res.OrderItemResponse;
import com.ztrios.Ecommerce.dto.res.OrderResponse;
import com.ztrios.Ecommerce.entity.*;
import com.ztrios.Ecommerce.exception.custom.BadRequestException;
import com.ztrios.Ecommerce.exception.custom.NotFoundException;
import com.ztrios.Ecommerce.repository.CartRepository;
import com.ztrios.Ecommerce.repository.OrderRepository;
import com.ztrios.Ecommerce.repository.ProductRepository;
import com.ztrios.Ecommerce.repository.UserRepository;
import com.ztrios.Ecommerce.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
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

        // 1️⃣ Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // 2️⃣ Validate cart existence
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Cart does not exist"));

        // 3️⃣ Validate cart is NOT empty
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty, cannot place order");
        }

        // 4️⃣ Convert cart → order items (with stock validation)
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(item -> {
                    Product product = item.getProduct();

                    if (product.getStockQuantity() < item.getQuantity()) {
                        throw new BadRequestException(
                                "Insufficient stock for product: " + product.getName()
                        );
                    }

                    // 5️⃣ Reduce stock
                    product.setStockQuantity(
                            product.getStockQuantity() - item.getQuantity()
                    );
                    productRepository.save(product);

                    return new OrderItem(
                            product,
                            item.getQuantity(),
                            product.getPrice()
                    );
                })
                .toList();

        // 6️⃣ Calculate total
        BigDecimal totalPrice = orderItems.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 7️⃣ Create order
        Order order = new Order(user, orderItems, totalPrice);
        orderRepository.save(order);

        // 8️⃣ Cleanup cart (delete or clear)
        cartRepository.delete(cart); // preferred (clean DB)

        // 9️⃣ Build response
        List<OrderItemResponse> itemsResp = orderItems.stream()
                .map(i -> new OrderItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getPrice()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                userId,
                itemsResp,
                totalPrice,
                order.getStatus().name()
        );
    }
}
