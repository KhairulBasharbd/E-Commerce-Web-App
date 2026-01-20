package com.ztrios.Ecommerce.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    protected CartItem() {}

    public CartItem(Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public UUID getId() { return id; }
    public Product getProduct() { return product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
