package com.ztrios.Ecommerce.config;


import com.ztrios.Ecommerce.entity.User;
import com.ztrios.Ecommerce.enums.Role;
import com.ztrios.Ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if ADMIN exists
        if (userRepository.findByEmail("admin@ecommerce.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("✅ Default ADMIN user created: admin@ecommerce.com / Admin@123");
        } else {
            System.out.println("ℹ ADMIN user already exists.");
        }
    }
}
