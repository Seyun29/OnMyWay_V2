package com.onmyway.omw_auth.controller;

import com.onmyway.omw_auth.dto.request.RegisterRequest;
import com.onmyway.omw_auth.service.UserService;
import org.springframework.web.bind.annotation.*;


//TODO: /error 경로 만들기** => applicaiton.yml에 적용

@RestController()
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {
        //FIXME: exception hadnling (try-catch), validation (java.validation.valid), responseentity.ok().body(...)
        userService.register(registerRequest);
        return "success"; //FIXME: return 값 수정 필요, 예외처리
    }

//    @PostMapping("/login") //Filter layer에서 처리
//    public String login(@RequestBody RegisterRequest loginRequest) { //FIXME: RegisterRequest -> LoginRequest
//        return "Login API TBU";
//    }

    @GetMapping("/logout")
    public String logout() { //서버에서 구현 필요?
        return "Logout API TBU";
    }
}