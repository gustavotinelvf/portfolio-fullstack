package com.gustavo.portfolio.config;

import com.gustavo.portfolio.model.Projeto;
import com.gustavo.portfolio.repository.ProjetoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.util.Arrays;

@Configuration // 1. Comunica ao Spring que esta classe é de configuração, ou seja, ela pode conter beans e outras configurações
public class TestConfig implements CommandLineRunner{
    
    private final ProjetoRepository projetoRepository;

    // O Spring faz a injeção de dependência aqui
    // ele entrega o repositório pronto para usarmos
    public TestConfig(ProjetoRepository projetoRepository){
        this.projetoRepository = projetoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        
        Projeto p1 = new Projeto();
        p1.setTitulo("Space Invaders");
        p1.setDescricao("Jogo clássico desenvolvido em java como projeto para disciplina de POO na UFS");
        p1.setLinkGithub("https://github.com/gustavotinelvf/SpaceInvaders.java");

        Projeto p2 = new Projeto();
        p2.setTitulo("Landing Page");
        p2.setDescricao("Landing page feita para consulta de orçamento para encomendas com uma artista plástica");
        p2.setLinkGithub("https://github.com/gustavotinelvf/Landing-Page");

        Projeto p3 = new Projeto();
        p3.setTitulo("Portfólio Pessoal");
        p3.setDescricao("Portfólio pessoal desenvolvido com Spring Boot e React, para mostrar meus projetos e habilidades");
        p3.setLinkGithub("https://github.com/gustavotinelvf/portfolio-fullstack");

        // salvando os projetos no banco de dados
        projetoRepository.saveAll(Arrays.asList(p1, p2, p3));

        System.out.println("Dados de teste inseridos com sucesso no banco de dados!");
    }
}