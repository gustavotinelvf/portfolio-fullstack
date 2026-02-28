// useState -> Para guardar dados na memória (projetos, loading, erro)
// useEffect -> Para executar ações automáticas (buscar dados ao iniciar)
import { useState, useEffect } from 'react'

// Importando o Axios para buscar dados no Java
import axios from 'axios'

// O react-router-dom permite que eu tenha várias páginas no mesmo site
// Adicionei o useNavigate para conseguirmos deslogar e mudar de página
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

// Importando meus componentes visuais
import ProjetoCard from './components/ProjetoCard'
import Hero from './components/Hero'
import Skills from './components/Skills'
import About from './components/About' // Seção Sobre Mim
import Footer from './components/Footer' // Rodapé

// --- NOVO IMPORT ---
// Importando o componente de Login que acabei de criar
import Login from './components/Login'
// Importando o "porteiro" que criamos para proteger a área do administrador
import PrivateRoute from './components/PrivateRoute'
// Importando a função de logout para limpar o token do navegador
import { logout } from './services/auth'

// Importando o estilo global
import './App.css'

// Criei este componente interno para podermos usar o hook useNavigate 
// sem dar erro de contexto do Router
function AppContent({ projetos, loading, error, HomePage }) {
  const navigate = useNavigate();

  // Função simples para encerrar a sessão do Gustavo
  const handleLogout = () => {
    logout(); // Remove o token do localStorage
    navigate('/'); // Redireciona para a vitrine pública
    console.log("Sessão encerrada. O acesso ao admin foi bloqueado novamente.");
  };

  return (
    <div className="app-wrapper">
      <Routes>
        {/* Rota Raiz: Onde o público vê meu portfólio profissional */}
        <Route path="/" element={<HomePage />} />

        {/* Rota de Login: Agora usando o componente formal com formulário */}
        <Route path="/login" element={<Login />} />

        {/* Rota de Administração: Envolvida pela Proteção de Rota (Só eu passo) */}
        <Route path="/admin" element={
          <PrivateRoute>
              <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 className="section-title">Painel de Controle</h2>
                <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                  Bem-vindo, Gustavo. O módulo de gerenciamento de projetos está em desenvolvimento.
                </p>
                
                {/* Botão de Logout para garantir que só você entre e saia quando quiser */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <button 
                    onClick={handleLogout}
                    className="btn-login"
                    style={{ backgroundColor: '#e74c3c', maxWidth: '200px' }}
                  >
                    Encerrar Sessão
                  </button>
                </div>
              </div>
          </PrivateRoute>
        } />
      </Routes>

      {/* 5. RODAPÉ: Finaliza a página em todas as rotas */}
      <Footer />
    </div>
  );
}

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

  // --- COMPONENTE DA PÁGINA INICIAL ---
  // Função que agrupa os componentes da vitrine pública (mantenho organizado)
  const HomePage = () => (
    <>
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
                <p>Carregando projetos do banco de dados...</p>
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
              {/* Para cada projeto na lista, crio um Card componentizado */}
              {projetos.map(projeto => (
                  <ProjetoCard key={projeto.id} projeto={projeto} />
              ))}
            </main>
        )}
      </div>
    </>
  );

  // --- O QUE VAI PARA A TELA (JSX) ---
  // Organizado com Router e o conteúdo que gerencia as rotas
  return (
    <Router>
      <AppContent 
        projetos={projetos} 
        loading={loading} 
        error={error} 
        HomePage={HomePage} 
      />
    </Router>
  )
}

export default App