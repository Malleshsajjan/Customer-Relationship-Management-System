package com.crm.service;

import com.crm.model.Customer;
import com.crm.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updated.getName());
            customer.setEmail(updated.getEmail());
            customer.setPhone(updated.getPhone());
            customer.setAddress(updated.getAddress());
            customer.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(customer);
        }).orElse(null);
    }

    public boolean softDeleteCustomer(Long id) {
        return customerRepository.findById(id).map(customer -> {
            customer.setDeletedAt(LocalDateTime.now());
            customerRepository.save(customer);
            return true;
        }).orElse(false);
    }
}
