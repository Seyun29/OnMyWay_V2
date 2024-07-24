package com.onmyway.omw_auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProxyController {
    @GetMapping("/")
    public String home() {
        return "Proxy Controller TBU";
    }
}