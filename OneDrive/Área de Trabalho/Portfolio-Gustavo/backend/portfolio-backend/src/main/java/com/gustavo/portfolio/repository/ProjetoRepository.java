package com.gustavo.portfolio.repository;

import com.gustavo.portfolio.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    // JpaRepository já traz vários métodos prontos para usar (CRUD)
    // Não precisamos implementar nada aqui, só declarar a interface
}