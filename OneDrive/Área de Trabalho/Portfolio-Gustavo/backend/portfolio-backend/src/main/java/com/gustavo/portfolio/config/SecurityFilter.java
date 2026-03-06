package com.gustavo.portfolio.config;

import com.gustavo.portfolio.repository.UsuarioRepository;
import com.gustavo.portfolio.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Marcamos como @Component para o Spring gerenciar esta classe automaticamente
@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    // Esse método roda exatamente uma vez em cada requisição que chega no Java
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Tenta recuperar o token que o React enviou no cabeçalho "Authorization"
        var tokenJWT = recuperarToken(request);

        // 2. Se houver um token, vamos validar
        if (tokenJWT != null) {
            // Validamos o token e pegamos o dono dele (o "subject" que definimos no TokenService)
            var subject = tokenService.getSubject(tokenJWT);
            
            // AJUSTE: Verificamos se o subject não é nulo antes de buscar no banco
            if (subject != null) {
                // Buscamos o usuário no banco para garantir que ele ainda existe e é válido
                var usuario = repository.findByLogin(subject);

                if (usuario != null) {
                    // Criamos um objeto de autenticação que o Spring Security entende
                    // AJUSTE: Passamos usuario.getAuthorities() para manter o padrao do Spring
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    
                    // Dizemos ao Spring: "Este cara está autenticado, pode deixar ele passar!"
                    // AJUSTE: Forçamos a limpeza de qualquer contexto anterior para evitar o erro 403 persistente
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        // 3. Continua o fluxo da requisição (passa para o próximo filtro ou para o Controller)
        filterChain.doFilter(request, response);
    }

    // Função auxiliar para limpar a string "Bearer " e pegar apenas o código do token
    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            // AJUSTE: Usamos trim() para garantir que espaços extras não quebrem o token
            return authorizationHeader.replace("Bearer ", "").trim();
        }
        return null;
    }
}