package com.gustavo.portfolio.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF para APIs Stateless
            // CORREÇÃO FINAL: CORS configurado aqui dentro do Spring Security, sem bean separado
            // Isso evita conflito de ordem de filtros que causava o bloqueio do OPTIONS/PUT
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Porta padrão do Vite/React
                config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
                config.setAllowCredentials(true);
                return config;
            }))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(req -> {
                // Rota de login sempre liberada
                req.requestMatchers(HttpMethod.POST, "/api/login").permitAll();

                // AJUSTE: Liberando explicitamente o GET de projetos para o público voltar a ver
                req.requestMatchers(HttpMethod.GET, "/api/projetos/**").permitAll();

                // AJUSTE: Liberando o pre-flight (OPTIONS) para o navegador não barrar o Axios
                req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();

                // AJUSTE: Agora qualquer usuario logado pode salvar ou excluir projetos
                req.anyRequest().authenticated();
            })
            // Filtro de token antes do filtro de login padrão
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Este metodo ensina o Spring a buscar o usuario no seu banco de dados
    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService userDetailsService(com.gustavo.portfolio.repository.UsuarioRepository repository) {
        return login -> repository.findByLogin(login);
    }
}