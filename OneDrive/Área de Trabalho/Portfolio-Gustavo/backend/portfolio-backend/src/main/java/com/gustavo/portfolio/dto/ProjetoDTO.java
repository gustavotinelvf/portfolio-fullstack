package com.gustavo.portfolio.dto;

import com.gustavo.portfolio.model.Projeto;

// 1. O 'record' é uma classe imutável. Depois de criada, ninguém muda os dados
// Exatamente o que eu preciso para transportar dados do Banco para o React
public record ProjetoDTO(
    Long id,
    String titulo,
    String descricao,
    String imagemUrl,
    String linkGithub,
    String linkDeploy
){
    // construtor especial para converter a Entidade em DTO
    // vai pegar o "produto bruto" e transformar no DTO
    public ProjetoDTO(Projeto projeto){
        this(projeto.getId(),
        projeto.getTitulo(),
        projeto.getDescricao(),
        projeto.getImagemUrl(),
        projeto.getLinkGithub(),
        projeto.getLinkDeploy()
    );
    }
}