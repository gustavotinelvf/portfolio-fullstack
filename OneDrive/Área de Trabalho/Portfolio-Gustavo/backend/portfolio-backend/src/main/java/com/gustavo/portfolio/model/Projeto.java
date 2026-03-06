package com.gustavo.portfolio.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String titulo;

    @Column(length = 500)
    private String descricao;

    private String imagemUrl;

    private String linkGithub;
    
    private String linkDeploy;

    private String linguagem; // Ex: Java, C, JS
    
    private String tipo;      // Ex: Aplicação Web, Jogo, Landing Page
}