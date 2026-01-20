package com.ztrios.Ecommerce.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment {

    public enum Status {
        PENDING, SUCCESS, FAILED
    }

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private Order order;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Status status;

    protected Payment() {}

    public Payment(Order order, BigDecimal amount, Status status) {
        this.order = order;
        this.amount = amount;
        this.status = status;
    }

    public UUID getId() { return id; }
    public Order getOrder() { return order; }
    public BigDecimal getAmount() { return amount; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

