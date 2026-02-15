package com.gustavo.portfolio.controller;

import com.gustavo.portfolio.dto.ProjetoDTO;

import com.gustavo.portfolio.repository.ProjetoRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // 1. Comunica ao Spring que esta classe é um CONTROLADOR REST, ou seja, ela vai responder a requisições HTTP
@RequestMapping("/api/projetos") // 2. Define a URL base para todas as rotas deste controlador
@CrossOrigin(origins = "*") // libera acesso de qualquer lugar
public class ProjetoController{

    // O "Garçom" precisa de acesso à Cozinha (repostitory)
    private final ProjetoRepository repository;

    // injeção de dependência via construtor (questão de boas práticas)
    public ProjetoController(ProjetoRepository repository) {
        this.repository = repository;
    }

    @GetMapping // Precisamos mudar o retorno: agora vamos devolver uma lista de DTOs, não de Entidades
    public List<ProjetoDTO> listarTodos(){

        // Buscamos as entidades no banco (Raw data)
        var projetosDoBanco = repository.findAll();

        // Aqui volto para PF (programação funcional), vista no primeiro período da UFS
        // .stream() -> transforma a lista numa esteira de produção
        //.map(ProjetoDTO::new) -> para cada projeto, cria um DTO usando o construtor que fizemos
        //.toList() -> Empacota tudo numa lista nova
        return projetosDoBanco.stream()
                .map(ProjetoDTO::new)
                .toList();
    }
}