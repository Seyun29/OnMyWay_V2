package com.onmyway.omw_auth.jwt;

import com.onmyway.omw_auth.domain.User;
import com.onmyway.omw_auth.dto.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

//@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        if (!requestURI.startsWith("/map/")) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("JWTFilter : requestURI starts with /map/");

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("JWTFilter : token is null"); //FIXME: use logger here
            filterChain.doFilter(request, response);
            return;
        }

//        String token = authorization.substring("Bearer ".length());
        String token = authorization.split(" ")[1];
        if (jwtUtil.isExpired(token)) {
            System.out.println("JWTFilter : token expired"); //FIXME: user logger here
            filterChain.doFilter(request, response);

            return;
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        User user = new User();
        user.setUsername(username);
        user.setPassword("temp"); //context holder에 정확한 pw가 필요하지 않음 (형식적)
        user.setRole(role);

        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        //Generate Spring Security Auth Token
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        //Set Auth Token to Security Context
        SecurityContextHolder.getContext()
                .setAuthentication(authToken);

        HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
            @Override
            public String getHeader(String name) {
                if ("is_user".equals(name)) {
                    return "true"; // 헤더 값 설정
                }
                return super.getHeader(name);
            }

            @Override
            public java.util.Enumeration<String> getHeaders(String name) {
                if ("is_user".equals(name)) {
                    return Collections.enumeration(Collections.singletonList("true"));
                }
                return super.getHeaders(name);
            }
        };

        filterChain.doFilter(wrappedRequest, response);
    }
}