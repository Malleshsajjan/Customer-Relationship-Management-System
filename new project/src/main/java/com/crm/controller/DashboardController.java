package com.crm.controller;

// DashboardController.java
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/total-users")
    public Map<String, Long> getTotalUsers() {
        long count = userRepository.count();
        Map<String, Long> response = new HashMap<>();
        response.put("totalUsers", count);
        return response;
    }

    @GetMapping("/total-customers")
    public Map<String, Long> getTotalCustomers() {
        long count = customerRepository.count();
        Map<String, Long> response = new HashMap<>();
        response.put("totalCustomers", count);
        return response;
    }
}
