package com.ztrios.Ecommerce.service.impl;


import com.ztrios.Ecommerce.dto.req.LoginRequest;
import com.ztrios.Ecommerce.dto.req.RegisterRequest;
import com.ztrios.Ecommerce.dto.res.AuthResponse;
import com.ztrios.Ecommerce.entity.User;
import com.ztrios.Ecommerce.enums.Role;
import com.ztrios.Ecommerce.exception.custom.BadRequestException;
import com.ztrios.Ecommerce.repository.UserRepository;
import com.ztrios.Ecommerce.security.JwtService;
import com.ztrios.Ecommerce.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                Role.CUSTOMER
        );

        userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        return new AuthResponse(jwtService.generateToken(user));
    }
}

