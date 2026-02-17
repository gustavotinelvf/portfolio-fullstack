package com.gustavo.portfolio.repository;

import com.gustavo.portfolio.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método que o Spring Security usa para autenticação
    UserDetails findByLogin(String login);
}