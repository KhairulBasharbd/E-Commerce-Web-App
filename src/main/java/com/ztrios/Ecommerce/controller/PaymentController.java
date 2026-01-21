package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Operation(
            summary = "Pay order (mock)",
            description = "Simulates payment success and updates order status",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Payment successful"),
                    @ApiResponse(responseCode = "404", description = "Order not found")
            }
    )
    @PostMapping("/{orderId}")
    public void pay(@PathVariable UUID orderId) {
        paymentService.payOrder(orderId);
    }
}

