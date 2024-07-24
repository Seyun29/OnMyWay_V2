package com.onmyway.omw_auth.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        //session 방식에서는 session이 고정되기 때문에 csrf를 방어해야하나, JWT는 session이 stateless하기 때문에 csrf를 disable해줄 수 있다.
        http.csrf(AbstractHttpConfigurer::disable);

        //Form 로그인 방식 disable
        http.formLogin(AbstractHttpConfigurer::disable);

        //http basic 인증 방식 disable
        http.httpBasic(AbstractHttpConfigurer::disable);

        http.headers((headerConfig) -> headerConfig.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        //경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth.requestMatchers("/auth/register", "/")
                .permitAll()
                .requestMatchers(PathRequest.toH2Console())//h2-console 접근 허용
                .permitAll()
                .requestMatchers("/admin")
                .hasRole("ADMIN")
                .anyRequest()
                .authenticated());

        //세션 설정 - STATELESS => JWT 토큰 사용
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}