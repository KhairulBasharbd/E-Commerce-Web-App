package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public void pay(@PathVariable UUID orderId) {
        paymentService.payOrder(orderId);
    }
}

