import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login(){
    // Estados para o formulário
    // guardo o que eu digito nos campos de email e senha
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')

    // O useNavigate serve para eu redirecionar o usuário depois do login 
    const navigate = useNavigate()

    // FUNÇÃO DE SUBMIT
    const handleLogin = (e) => {
        // evito que a página recarregue ao clicar no botão
        e.preventDefault()

        // Até então, o que sei fazer é uma validação simples (mock)
        // Assim que possível irei integrar com o Spring Security + JWT do java
        if(email === 'admin@gustavo.com' && senha === 'Gust@v0.03'){
            console.log("Acesso autorizado!")
            // se der certo, vai para a rota do Dashboard
            navigate('/admin')
        } else {
            // se der erro, exibo a mensagem abaixo na tela
            setErro("Credenciais inválidas. Tente novamente")
        }
    }

    return (
        <div className = "login-container">
            <form className = "login-form" onSubmit = {handleLogin}>
                <h2 className = "login-title">Acesso <span ClassName ="highlight">Restrito</span></h2>
                <p className = "login-subtitle">Entre com suas credenciais para gerenciar o sistema.</p>
                {/* Exibo a mensagem de erro apenas se o estaro 'erro' não estiver vazio */}
                {erro && <div className = "login-error">{erro}</div>}
                
                <div className = "input-group">
                    <label htmlFor = "email">E-mail</label>
                    <input
                        type = "email"
                        id = "email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        placeholder = "seu@email.com"
                        required
                    />
                </div>
                
                <div className = "input-group">
                    <label htmlFor = "password">Senha</label>
                    <input
                        type = "password"
                        id = "password"
                        value = {senha}
                        onChange = {(e) => setSenha(e.target.value)}
                        placeholder = "••••••••"
                        required
                    />
                </div>
                <button type = "submit" className = 'btn-login'>Acessar Painel</button>
            </form>
        </div>
    )
}

export default Login