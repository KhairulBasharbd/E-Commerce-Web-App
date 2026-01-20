package com.ztrios.Ecommerce.service;


import com.ztrios.Ecommerce.dto.req.LoginRequest;
import com.ztrios.Ecommerce.dto.req.RegisterRequest;
import com.ztrios.Ecommerce.dto.res.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
