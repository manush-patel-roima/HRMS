package com.company.hrms.config;

import com.company.hrms.security.CustomUserDetails;
import com.company.hrms.security.CustomUserDetailsService;
import com.company.hrms.security.JwtTokenProvider;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.Map;

public class WebSocketAuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public WebSocketAuthHandshakeInterceptor(JwtTokenProvider tokenProvider, CustomUserDetailsService userDetailsService){
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        String authHeader = request.getHeaders().getFirst("Authorization");
        String token = null;
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
        }

        if(token == null){
            // try query param
            String query = request.getURI().getQuery();
            if(query != null && query.contains("token=")){
                for(String q : query.split("&")){
                    if(q.startsWith("token=")){
                        token = q.substring(6);
                        break;
                    }
                }
            }
        }

        if(token != null){
            String username = tokenProvider.getUsernameFromJWT(token);
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);


            Principal principal = authentication;
            attributes.put("principal", principal);

            return true;
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}

