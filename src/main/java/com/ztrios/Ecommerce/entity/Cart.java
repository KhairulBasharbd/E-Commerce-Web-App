package com.ztrios.Ecommerce.entity;


import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cart_id")
    private List<CartItem> items = new ArrayList<>();

    protected Cart() {}

    public Cart(User user) {
        this.user = user;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public List<CartItem> getItems() { return items; }

    public void addItem(CartItem item) {
        items.add(item);
    }

    public void removeItem(UUID productId) {
        items.removeIf(i -> i.getProduct().getId().equals(productId));
    }
}
