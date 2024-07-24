package com.onmyway.omw_auth.controller;

import com.onmyway.omw_auth.dto.request.RegisterRequest;
import com.onmyway.omw_auth.servivce.RegisterService;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/auth")
public class AuthController {

    private final RegisterService registerService;

    public AuthController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {
        //FIXME: exception hadnling (try-catch), validation (java.validation.valid), responseentity.ok().body(...)
        registerService.register(registerRequest);
        return "success"; //FIXME: return 값 수정 필요, 예외처리
    }

    @GetMapping("/login")
    public String login() {
        return "Login API TBU";
    }

    @GetMapping("/logout")
    public String logout() { //서버에서 구현 필요?
        return "Logout API TBU";
    }
}