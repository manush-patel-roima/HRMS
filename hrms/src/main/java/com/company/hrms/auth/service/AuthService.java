package com.company.hrms.auth.service;

import com.company.hrms.auth.dto.LoginRequest;
import com.company.hrms.auth.dto.LoginResponse;
import com.company.hrms.common.exception.UnauthorizedException;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.security.JwtTokenProvider;
import org.springframework.security.authentication.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       EmployeeRepository employeeRepository,
                       JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.employeeRepository = employeeRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponse login(LoginRequest request) {

        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        }catch (BadCredentialsException ex){
            throw new UnauthorizedException("Invalid email or password");
        }


        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));


        String token = jwtTokenProvider.generateToken(employee.getEmail());

        return new LoginResponse(token, employee.getRole().getRoleName(), employee.getEmployeeId());
    }
}