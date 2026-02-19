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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    // Injetamos o filtro que criamos para validar o token JWT
    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF para APIs Stateless
            .cors(cors -> cors.configure(http)) // Habilita o CORS que configuraremos abaixo
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
            .authorizeHttpRequests(req -> {
                // Permite login e consulta de projetos sem autenticacao
                req.requestMatchers(HttpMethod.POST, "/api/login").permitAll();
                req.requestMatchers(HttpMethod.GET, "/api/projetos/**").permitAll();
                
                // Qualquer outra acao exige estar logado
                req.anyRequest().authenticated();
            })
            // ADICIONADO: Diz para o Spring usar o nosso filtro de token ANTES do filtro de login padrão
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

    // --- CONFIGURACAO DE CORS PARA O REACT CONSEGUIR ACESSAR ---
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173") // Porta padrao do seu Vite/React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    // Este metodo ensina o Spring a buscar o usuario no seu banco de dados
    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService userDetailsService(com.gustavo.portfolio.repository.UsuarioRepository repository) {
        return login -> repository.findByLogin(login);
    }
}