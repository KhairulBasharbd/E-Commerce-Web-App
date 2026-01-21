package com.ztrios.Ecommerce.service.impl;


import com.ztrios.Ecommerce.entity.Order;
import com.ztrios.Ecommerce.entity.Payment;
import com.ztrios.Ecommerce.exception.custom.BadRequestException;
import com.ztrios.Ecommerce.exception.custom.NotFoundException;
import com.ztrios.Ecommerce.repository.OrderRepository;
import com.ztrios.Ecommerce.repository.PaymentRepository;
import com.ztrios.Ecommerce.service.PaymentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(OrderRepository orderRepository,
                              PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void payOrder(UUID orderId) {

        // 1️⃣ Validate order existence
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // 2️⃣ Validate order status
        if (order.getStatus() != Order.Status.CREATED) {
            throw new BadRequestException(
                    "Order cannot be paid in status: " + order.getStatus()
            );
        }

        // 3️⃣ Prevent duplicate payment
        if (paymentRepository.existsByOrder(order)) {
            throw new BadRequestException("Order is already paid");
        }

        // 4️⃣ Create payment (mock success)
        Payment payment = new Payment(
                order,
                order.getTotalPrice(),
                Payment.Status.SUCCESS
        );
        paymentRepository.save(payment);

        // 5️⃣ Update order status
        order.setStatus(Order.Status.CONFIRMED);
        orderRepository.save(order);
    }
}


