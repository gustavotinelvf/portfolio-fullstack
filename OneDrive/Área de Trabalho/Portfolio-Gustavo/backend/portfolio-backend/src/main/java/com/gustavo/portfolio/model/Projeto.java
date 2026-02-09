package com.gustavo.portfolio.model;

import jakarta.persistence.*; // importa as coisas de Banco de Dados (JPA)
import lombok.Data; // importa o Lombok para gerar getters, setters, etc.

@Entity // 1. Comunica ao Spring que esta classe é uma TABELA no banco de dados
@Data // 2. O Lombok gera automaticamente: Getters, Setters, toString, equals, hashCode, etc.
      // Sem isso, teríamos que escrever umas 50 linhas de código só para os getters e setters


public class Projeto {
    @Id // 3. Diz que este campo é a CHAVE PRIMÁRIA da tabela, ou seja, o identificador único de cada registro
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String titulo;

    @Column(length = 500) // bom para configurar detalhes. Não é obrigatória se o nome for igual ao nome da coluna no banco
    private String descricao;

    private String imagemUrl; // link da imagem

    private String linkGithub; // link do repositório no GitHub
    
    private String linkDeploy; // link do projeto online (se tiver)
}