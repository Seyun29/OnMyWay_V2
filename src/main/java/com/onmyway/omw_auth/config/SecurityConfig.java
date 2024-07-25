package com.onmyway.omw_auth.config;

import com.onmyway.omw_auth.jwt.LoginFilter;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration) {
        this.authenticationConfiguration = authenticationConfiguration;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
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
        http.authorizeHttpRequests((auth) -> auth.requestMatchers("/auth/**", "/")
                .permitAll()
                .requestMatchers(PathRequest.toH2Console())//h2-console 접근 허용
                .permitAll()
                .requestMatchers("/admin")
                .hasRole("ADMIN")
                .anyRequest()
                .authenticated());

        //필터 추가 LoginFilter()는 인자를 받음 (AuthenticationManager() 메소드에 authenticationConfiguration 객체를 넣어야 함) 따라서 등록 필요
        //param : Filter, 위치는 어디인가;
        http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration)), UsernamePasswordAuthenticationFilter.class);

        //세션 설정 - STATELESS => JWT 토큰 사용
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}