package com.gustavo.portfolio.controller;

import com.gustavo.portfolio.model.Projeto;
import com.gustavo.portfolio.repository.ProjetoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController // 1. Comunica ao Spring que esta classe é um CONTROLADOR REST, ou seja, ela vai responder a requisições HTTP
@RequestMapping("/api/projetos") // 2. Define a URL base para todas as rotas deste controlador
public class ProjetoController{

    // O "Garçom" precisa de acesso à Cozinha (repostitory)
    private final ProjetoRepository projetoRepository;

    // injeção de dependência via construtor (questão de boas práticas)
    public ProjetoController(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    @GetMapping // 3. Define que este método responde a requisições GET na URL "/api/projetos"
    public List<Projeto> listarTodos(){
        // o método .findAll() já vem pronto do JPA, ele busca todos os registros da tabela "projeto" e retorna como uma lista de objetos Projeto
        return projetoRepository.findAll();
    }

}