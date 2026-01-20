package com.ztrios.Ecommerce.repository;


import com.ztrios.Ecommerce.entity.Cart;
import com.ztrios.Ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUser(User user);
}