package com.crm.repository;

import com.crm.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByDeletedAtIsNull(); // Active customers only
    long count();
}
