package com.ztrios.Ecommerce.repository;

import com.ztrios.Ecommerce.entity.Order;
import com.ztrios.Ecommerce.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Boolean existsByOrder(Order order);
}

