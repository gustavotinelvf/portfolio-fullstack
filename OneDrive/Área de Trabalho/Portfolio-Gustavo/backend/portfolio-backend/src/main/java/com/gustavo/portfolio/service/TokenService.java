package com.gustavo.portfolio.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.gustavo.portfolio.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Essa chave deve ser secreta e complexa. 
    // Por enquanto, definimos um valor padrao se nao encontrar no application.properties
    @Value("${api.security.token.secret:minha-chave-secreta-123}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            // Algoritmo HMAC256 para assinar o token com a nossa chave secreta
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            
            return JWT.create()
                    .withIssuer("portfolio-api") // Quem emitiu o token
                    .withSubject(usuario.getLogin()) // De quem e este token
                    .withExpiresAt(dataExpiracao()) // Quando este cracha vence
                    .sign(algoritmo);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token jwt", exception);
        }
    }

    public String getSubject(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("portfolio-api")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT invalido ou expirado!");
        }
    }

    // O token vai valer por 2 horas para garantir seguranca
    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}