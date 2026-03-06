package com.gustavo.portfolio.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.gustavo.portfolio.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority; // Importação necessária
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {

    @Value("${api.security.token.secret:sequencia_longa_e_aleatoria_que_eu_acabei_de_inventar_com_toda_a_criatividade_restante!Gustavo2003@}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            
            // EXTRAÇÃO DAS ROLES: Pegamos o ROLE_ADMIN que você definiu no Usuario.java
            var authorities = usuario.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return JWT.create()
                    .withIssuer("portfolio-api")
                    .withSubject(usuario.getLogin())
                    .withClaim("roles", authorities) // ADICIONADO: Salvando o poder do Gustavo no Token
                    .withExpiresAt(dataExpiracao())
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
            return null; // Retornamos null para o SecurityFilter saber que deu erro
        }
    }

    private Instant dataExpiracao() {
        return Instant.now().plusSeconds(7200);
    }
}