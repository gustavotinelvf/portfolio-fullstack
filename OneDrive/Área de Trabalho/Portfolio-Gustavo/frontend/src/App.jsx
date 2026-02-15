// frontend/src/App.jsx

// Importando os hooks do React:
// useState -> Para guardar dados na memória (projetos, loading, erro)
// useEffect -> Para executar ações automáticas (buscar dados ao iniciar)
import { useState, useEffect } from 'react'

// Importando o Axios, nosso "carteiro" que busca dados no Java
import axios from 'axios'

// Importando meus componentes visuais (dividir para conquistar!)
import ProjetoCard from './components/ProjetoCard'
import Hero from './components/Hero'
import Skills from './components/Skills'
import About from './components/About' // Seção Sobre Mim
import Footer from './components/Footer' // Rodapé

// Importando o estilo global
import './App.css'

function App() {
  // --- DECLARAÇÃO DE ESTADOS (MEMÓRIA) ---
  
  // 1. Onde guardo a lista de projetos que vem do banco
  const [projetos, setProjetos] = useState([])
  
  // 2. Controla se o spinner de carregamento deve aparecer (começa true)
  const [loading, setLoading] = useState(true)
  
  // 3. Guarda mensagem de erro se a conexão falhar
  const [error, setError] = useState(null)

  // --- EFEITOS (CICLO DE VIDA) ---
  // Esse bloco roda automaticamente assim que o site abre
  useEffect(() => {
    console.log("Chamando a API do Java...")

    // Tenta buscar na porta 8080 (onde o Spring Boot roda)
    axios.get('http://localhost:8080/api/projetos')
      .then(resposta => {
        // SUCESSO: O Java respondeu!
        // Guardo os projetos na memória
        setProjetos(resposta.data)
        // Desligo o aviso de "Carregando"
        setLoading(false)
      })
      .catch(erro => {
        // ERRO: O Java não respondeu ou deu erro
        console.error("Putz, falha na conexão:", erro)
        // Defino uma mensagem amigável para o usuário
        setError("Não consegui conectar ao servidor (Java). Verifique se o Backend está rodando.")
        // Paro o loading pra não ficar travado
        setLoading(false)
      })
  }, []) // O array vazio [] garante que isso roda só 1 vez

  // --- O QUE VAI PARA A TELA (JSX) ---
  return (
    <div className="app-wrapper">
      
      {/* 1. HERO SECTION: Apresentação inicial impactante */}
      <Hero />

      {/* 2. SOBRE MIM: Quem sou eu (UFS, História) */}
      <About />

      {/* 3. SKILLS: Minhas habilidades técnicas e idiomas */}
      <Skills />

      {/* 4. ÁREA DE PROJETOS (GRID) */}
      <div className="container" id="projetos">
        {/* Título da seção (Alterado conforme pedido) */}
        <h2 className="section-title">Projetos Realizados</h2>

        {/* LÓGICA DE EXIBIÇÃO: */}
        
        {/* Cenário A: Está carregando? Mostra o spinner */}
        {loading && (
            <div className="status-message">
                <div className="spinner"></div>
                <p>Invocando projetos do banco de dados...</p>
            </div>
        )}

        {/* Cenário B: Deu erro? Mostra o alerta vermelho */}
        {error && (
            <div className="error-message">
                <p>⚠️ {error}</p>
            </div>
        )}

        {/* Cenário C: Tudo certo? Mostra os cards */}
        {!loading && !error && (
            <main className="projects-grid">
              {/* Percorro a lista e crio um Card para cada projeto */}
              {projetos.map(projeto => (
                  <ProjetoCard key={projeto.id} projeto={projeto} />
              ))}
            </main>
        )}
      </div>

      {/* 5. RODAPÉ: Finaliza a página */}
      <Footer />
    </div>
  )
}

export default App