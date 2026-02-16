package com.gustavo.portfolio.controller;

import com.gustavo.portfolio.dto.ProjetoDTO;
import com.gustavo.portfolio.service.ProjetoService; // Agora usamos o Service, não o Repository
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projetos")
@CrossOrigin(origins = "*")
public class ProjetoController {

    private final ProjetoService service;

    // Injeção de dependência do Serviço
    public ProjetoController(ProjetoService service) {
        this.service = service;
    }

    // GET: http://localhost:8080/api/projetos
    @GetMapping
    public List<ProjetoDTO> listar() {
        return service.listarTodos();
    }

    // POST: http://localhost:8080/api/projetos
    // @RequestBody diz: "Pegue o JSON que veio e transforme em DTO"
    @PostMapping
    public ResponseEntity<ProjetoDTO> criar(@RequestBody ProjetoDTO dto) {
        ProjetoDTO novoProjeto = service.salvar(dto);
        // Retorna status 200 (OK) com o projeto criado
        return ResponseEntity.ok(novoProjeto);
    }

    // PUT: http://localhost:8080/api/projetos/1 (onde 1 é o ID)
    @PutMapping("/{id}")
    public ResponseEntity<ProjetoDTO> atualizar(@PathVariable Long id, @RequestBody ProjetoDTO dto) {
        ProjetoDTO atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    // DELETE: http://localhost:8080/api/projetos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        // Retorna 204 No Content (Deu certo, mas não tem nada pra mostrar)
        return ResponseEntity.noContent().build();
    }
}