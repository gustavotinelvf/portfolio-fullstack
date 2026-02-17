package com.gustavo.portfolio.config;

import com.gustavo.portfolio.model.Projeto;
import com.gustavo.portfolio.model.Usuario;
import com.gustavo.portfolio.repository.ProjetoRepository;
import com.gustavo.portfolio.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration 
public class TestConfig implements CommandLineRunner {
    
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Injeção de dependência necessária
    public TestConfig(ProjetoRepository projetoRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder){
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // --- CRIAÇÃO DO USUÁRIO ADMIN ---
        // Verifico se já existe um usuário para não duplicar
        if (usuarioRepository.count() == 0) {
            // Defina aqui seu login e senha (mantenha em segurança!)
            String senhaCriptografada = passwordEncoder.encode("Gust@v0.03");
            Usuario admin = new Usuario(null, "gustavo@admin.com", senhaCriptografada);
            usuarioRepository.save(admin);
            System.out.println("Usuário Admin criado com sucesso!");
        }

        // Verifico se o banco já tem algum registro.
        // Se count() for maior que 0, significa que os dados já existem, então eu pulo.
        if (projetoRepository.count() > 0) {
            System.out.println("O Banco de Dados já está preenchido. Pulei a criação de testes.");
            return; // O return encerra a execução do método aqui.
        }

        // Se chegou aqui, é porque o banco estava vazio (count == 0).
        // Então eu crio os projetos iniciais.

        Projeto p1 = new Projeto();
        p1.setTitulo("Space Invaders");
        p1.setDescricao("Jogo clássico desenvolvido em java como projeto para disciplina de POO na UFS");
        p1.setImagemUrl("/img/icones/Navezinha.png"); // Adicionei imagem placeholder pra não ficar vazio
        p1.setLinkGithub("https://github.com/gustavotinelvf/SpaceInvaders.java");

        Projeto p2 = new Projeto();
        p2.setTitulo("Landing Page");
        p2.setDescricao("Landing page feita para consulta de orçamento para encomendas com uma artista plástica");
        p2.setImagemUrl("/img/icones/devWeb.png");
        p2.setLinkGithub("https://github.com/gustavotinelvf/Landing-Page");

        Projeto p3 = new Projeto();
        p3.setTitulo("Portfólio Pessoal");
        p3.setDescricao("Portfólio pessoal desenvolvido com Spring Boot e React, para mostrar meus projetos e habilidades");
        p3.setImagemUrl("/img/icones/devWeb.png");
        p3.setLinkGithub("https://github.com/gustavotinelvf/portfolio-fullstack");

        // salvando os projetos no banco de dados
        projetoRepository.saveAll(Arrays.asList(p1, p2, p3));

        System.out.println("Banco estava vazio. Dados de teste inseridos com sucesso!");
    }
}