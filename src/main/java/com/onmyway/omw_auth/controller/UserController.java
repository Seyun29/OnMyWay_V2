package com.onmyway.omw_auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/user")
public class UserController {
    @GetMapping("/favorites")
    public String favorites() {
        return "favorites TBU";
    }

    @PostMapping("/favorites")
    public String addFavorites() {
        return "addFavorites TBU";
    }

    @GetMapping("/history")
    public String history() {
        return "history TBU";
    }

    @PostMapping("/history")
    public String addHistory() {
        return "addHistory TBU";
    }
}