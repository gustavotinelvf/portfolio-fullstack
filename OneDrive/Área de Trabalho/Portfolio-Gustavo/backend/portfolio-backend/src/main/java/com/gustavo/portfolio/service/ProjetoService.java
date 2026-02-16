package com.gustavo.portfolio.service;

import com.gustavo.portfolio.dto.ProjetoDTO;
import com.gustavo.portfolio.model.Projeto;
import com.gustavo.portfolio.repository.ProjetoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Isso destaca para o Spring que essa é a parte "cérebro"
public class ProjetoService{

    private final ProjetoRepository repository;

    public ProjetoService(ProjetoRepository repository){
        this.repository = repository;
    }

    // 1. Listar (read do crud)
    public List<ProjetoDTO> listarTodos(){
        return repository.findAll().stream()
                .map(ProjetoDTO::new)
                .toList();
    }

    // 2. Salvar (create do crud)
    public ProjetoDTO salvar(ProjetoDTO dto){
        // Converte o DTO para Entidade antes de salvar
        // é como se estivessemos transformando ou levando um papel a um cofre
        Projeto projeto = new Projeto();
        projeto.setTitulo(dto.titulo());
        projeto.setDescricao(dto.descricao());
        projeto.setImagemUrl(dto.imagemUrl());
        projeto.setLinkGithub(dto.linkGithub());
        projeto.setLinkDeploy(dto.linkDeploy()); 

        // O banco salva e devolve a entidade com o ID gerado
        Projeto salvo = repository.save(projeto);

        // retorna em forma de DTO
        return new ProjetoDTO(salvo);
    }

    // 3. Atualizar (update do crud)
    public ProjetoDTO atualizar(Long id, ProjetoDTO dto){
        // primeiro buscamos se existe. Se não existir lança o tratamento de erro (RuntimeException simples por ora)
        Projeto projeto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado!"));

        // atualiza os dados
        projeto.setTitulo(dto.titulo());
        projeto.setDescricao(dto.descricao());
        projeto.setImagemUrl(dto.imagemUrl());
        projeto.setLinkGithub(dto.linkGithub());
        projeto.setLinkDeploy(dto.linkDeploy());

        Projeto atualizado = repository.save(projeto);
        return new ProjetoDTO(atualizado);
    }

    // 4. Deletar (delete do crud)
    public void deletar(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Projeto não encontrado para deletar!");
        }
        repository.deleteById(id);
    }
}



