package com.onmyway.omw_auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; //mapped to TIMESTAMP data type in SQL

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}