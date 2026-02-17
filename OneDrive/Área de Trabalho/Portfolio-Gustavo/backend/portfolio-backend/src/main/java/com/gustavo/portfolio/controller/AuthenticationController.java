package com.gustavo.portfolio.controller;

import com.gustavo.portfolio.dto.DadosAutenticacao;
import com.gustavo.portfolio.dto.DadosTokenJWT;
import com.gustavo.portfolio.model.Usuario;
import com.gustavo.portfolio.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        // 1. Criamos um "token" interno do Spring com login e senha
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        
        // 2. O manager tenta autenticar (chama o UsuarioRepository e compara o hash da senha)
        var authentication = manager.authenticate(authenticationToken);

        // 3. Se passou, geramos o JWT para o usuario logado
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        // 4. Devolvemos o token dentro do DTO para o frontend
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}