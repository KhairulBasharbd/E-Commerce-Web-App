package com.ztrios.Ecommerce.service;


import java.util.UUID;

public interface PaymentService {
    void payOrder(UUID orderId);
}
