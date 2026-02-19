// frontend/src/components/Login.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// Importei a lógica de salvar o token
import { login } from '../services/auth' 
import './Login.css'

function Login() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const navigate = useNavigate()

  // --- FUNÇÃO DE SUBMIT (A conexão real começa aqui) ---
  const handleLogin = async (e) => {
    e.preventDefault() // Impede o recarregamento da página
    setErro('') // Limpa erros antigos

    try {
        // 1. Chamamos o Java no endpoint que você validou no Postman
        // Enviamos o login e senha no formato JSON que o Java espera
        const resposta = await axios.post('http://localhost:8080/api/login', {
            login: email, // O campo no seu DTO Java chama-se "login"
            senha: senha
        });

        // 2. Se deu certo (200 OK), pegamos o token da resposta
        const token = resposta.data.token;

        // 3. Usamos nossa função para salvar esse token no navegador
        login(token);

        console.log("Login realizado com sucesso! Token guardado.");
        
        // 4. Redirecionamos o Gustavo para a área administrativa
        navigate('/admin');

    } catch (err) {
        // Se o Java retornar 403 (Forbidden) ou 401, caímos aqui
        console.error("Falha no login:", err);
        setErro("E-mail ou senha inválidos. Verifique suas credenciais.");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Acesso <span className="highlight">Restrito</span></h2>
        
        {erro && <div className="login-error">{erro}</div>}

        <div className="input-group">
          <label htmlFor="email">E-mail Administrativo</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
            placeholder="exemplo@admin.com"
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            required 
          />
        </div>

        <button type="submit" className="btn-login">Autenticar Sistema</button>
      </form>
    </div>
  )
}

export default Login