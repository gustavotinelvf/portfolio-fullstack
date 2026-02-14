import { useState, useEffect } from 'react'
import axios from 'axios'
import ProjetoCard from './components/ProjetoCard'
import Hero from './components/Hero'
import Footer from './components/Footer' // <--- 1. Importe o Footer
import './App.css'

function App() {
  const [projetos, setProjetos] = useState([])
  
  // NOVOS ESTADOS PARA CONTROLE DE UX
  const [loading, setLoading] = useState(true) // Começa carregando
  const [error, setError] = useState(null)     // Começa sem erros

  useEffect(() => {
    axios.get('http://localhost:8080/api/projetos')
      .then(resposta => {
        setProjetos(resposta.data)
        setLoading(false) // Parar de carregar
      })
      .catch(erro => {
        console.error("Erro:", erro)
        setError("Não foi possível conectar ao Backend. O servidor Java está ligado?")
        setLoading(false) // Parar de carregar mesmo com erro
      })
  }, [])

  return (
    <div className="app-wrapper">
      <Hero />

      <div className="container" id="projetos">
        <h2 className="section-title">Meus Projetos</h2>

        {/* CENÁRIO 1: CARREGANDO */}
        {loading && (
            <div className="status-message">
                <div className="spinner"></div>
                <p>Carregando projetos...</p>
            </div>
        )}

        {/* CENÁRIO 2: ERRO */}
        {error && (
            <div className="error-message">
                <p>⚠️ {error}</p>
            </div>
        )}

        {/* CENÁRIO 3: SUCESSO (GRID) */}
        {!loading && !error && (
            <main className="projects-grid">
            {projetos.map(projeto => (
                <ProjetoCard key={projeto.id} projeto={projeto} />
            ))}
            </main>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default App