package com.onmyway.omw_auth.service;

import com.onmyway.omw_auth.domain.User;
import com.onmyway.omw_auth.dto.request.RegisterRequest;
import com.onmyway.omw_auth.enums.Role;
import com.onmyway.omw_auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RegisterService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public RegisterService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    ;

    public void register(RegisterRequest registerRequest) throws RuntimeException {
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();

        boolean isExist = userRepository.existsByUsername(username);

        if (isExist) {
            //FIXME: fixme "Username already exists"
            throw new RuntimeException("Username already exists");
        }

        User data = new User();

        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setRole(String.valueOf(Role.ROLE_USER)); //FIXME: apply ENUM type, fix roles
        //add time stamp here
        data.setCreatedAt(LocalDateTime.now());
        //        data.setDeleted(false); -> set as default in User.java

        userRepository.save(data);
    }

}