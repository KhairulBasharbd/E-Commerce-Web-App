package com.ztrios.Ecommerce.entity;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "orders")
public class Order {

    public enum Status {
        CREATED, CONFIRMED, SHIPPED, DELIVERED
    }

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private Status status = Status.CREATED;

    protected Order() {}

    public Order(User user, List<OrderItem> items, BigDecimal totalPrice) {
        this.user = user;
        this.items = items;
        this.totalPrice = totalPrice;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public List<OrderItem> getItems() { return items; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

