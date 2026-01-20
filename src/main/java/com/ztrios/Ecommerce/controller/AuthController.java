package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.dto.req.LoginRequest;
import com.ztrios.Ecommerce.dto.req.RegisterRequest;
import com.ztrios.Ecommerce.dto.res.AuthResponse;
import com.ztrios.Ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }
}

