package com.company.hrms.security;

import com.company.hrms.employee.entity.Employee;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final Employee employee;

    public CustomUserDetails(Employee employee){
        this.employee = employee;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return Collections.singleton(
                new SimpleGrantedAuthority("ROLE_"+employee.getRole().getRoleName())
        );
    }

    @Override
    public String getPassword(){
        return employee.getPasswordHash();
    }

    @Override
    public String getUsername(){
        return employee.getEmail();
    }

    public Integer getEmployeeId(){
        return employee.getEmployeeId();
    }

    @Override public boolean isAccountNonExpired() {
        return true;
    }

    @Override public boolean isAccountNonLocked(){
        return true;
    }

    @Override public boolean isCredentialsNonExpired(){
        return true;
    }

    @Override public boolean isEnabled(){
        return employee.getIsActive();
    }
}
