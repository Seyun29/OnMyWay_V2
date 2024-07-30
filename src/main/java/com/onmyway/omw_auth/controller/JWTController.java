package com.onmyway.omw_auth.controller;

import com.onmyway.omw_auth.jwt.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class JWTController {
    private final JWTUtil jwtUtil;

    public JWTController(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = request.getHeader("refreshToken");

        if (refreshToken == null) {
            return new ResponseEntity<>("Invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String token = refreshToken.split(" ")[1];
        if (jwtUtil.isExpired(token)) {
            return new ResponseEntity<>("Refresh token expired", HttpStatus.FORBIDDEN);
        }

        String type = jwtUtil.getType(token);
        if (!type.equals("refresh") || !refreshToken.startsWith("Bearer ")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        String newAccessToken = jwtUtil.createJwt("access", username, role, 600000L);
        String newRefreshToken = jwtUtil.createJwt("refresh", username, role, 86400000L);
        //response
        response.setHeader("accessToken", newAccessToken);
        response.setHeader("refreshToken", newRefreshToken);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}