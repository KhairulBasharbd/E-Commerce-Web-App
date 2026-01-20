package com.ztrios.Ecommerce.service.impl;


import com.ztrios.Ecommerce.entity.Order;
import com.ztrios.Ecommerce.entity.Payment;
import com.ztrios.Ecommerce.repository.OrderRepository;
import com.ztrios.Ecommerce.repository.PaymentRepository;
import com.ztrios.Ecommerce.service.PaymentService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
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
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment(order, order.getTotalPrice(), Payment.Status.SUCCESS);
        paymentRepository.save(payment);

        order.setStatus(Order.Status.CONFIRMED);
        orderRepository.save(order);
    }
}

