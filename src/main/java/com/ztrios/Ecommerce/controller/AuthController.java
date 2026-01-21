package com.ztrios.Ecommerce.controller;


import com.ztrios.Ecommerce.dto.req.LoginRequest;
import com.ztrios.Ecommerce.dto.req.RegisterRequest;
import com.ztrios.Ecommerce.dto.res.AuthResponse;
import com.ztrios.Ecommerce.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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

    @Operation(
            summary = "Register a new user",
            description = "Registers a new CUSTOMER user",
            requestBody = @RequestBody(
                    required = true,
                    description = "RegisterRequest JSON",
                    content = @Content(schema = @Schema(implementation = RegisterRequest.class),
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = """
                                               {
                                                 "email": "user@test.com",
                                                 "password": "Password123"
                                               }
                                               """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "User registered successfully",
                            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Email already exists")
            }
    )
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @org.springframework.web.bind.annotation.RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @Operation(
            summary = "Login user",
            description = "Authenticates user and returns JWT token",
            requestBody = @RequestBody(
                    required = true,
                    description = "LoginRequest JSON",
                    content = @Content(schema = @Schema(implementation = LoginRequest.class),
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    value = """
                                               {
                                                 "email": "user@test.com",
                                                 "password": "Password123"
                                               }
                                               """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login successful",
                            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid credentials")
            }
    )
    @PostMapping("/login")
    public AuthResponse login(@Valid @org.springframework.web.bind.annotation.RequestBody LoginRequest request) {
        return service.login(request);
    }
}
