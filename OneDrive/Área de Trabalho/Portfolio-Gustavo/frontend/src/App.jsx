// Importando os hooks do React:
// useState -> Para guardar dados na memória (projetos, loading, erro)
// useEffect -> Para executar ações automatizadas (buscar dados ao iniciar)
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
// importar nossa API com o interceptor de Token (preparado para o DELETE futuro)
import api from './services/api';

// Importando o estilo global
import './App.css'

// Criei este componente interno para podermos usar o hook useNavigate 
// sem dar erro de contexto do Router
function AppContent({ projetos, setProjetos, loading, error, HomePage }) {
  const navigate = useNavigate();

  // --- ESTADOS PARA O NOVO PROJETO (CADASTRO) ---
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  // Adicionando estados para os novos campos: Link e Imagem
  const [novoLink, setNovoLink] = useState('');
  const [novaImagem, setNovaImagem] = useState('');

  // --- FUNÇÃO PARA CADASTRAR NOVO PROJETO (POST) ---
  const handleCadastrar = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    
    try {
      // Enviamos os dados para o Java. A 'api' já inclui o seu Token JWT.
      const response = await api.post('/api/projetos', {
        titulo: novoTitulo,
        descricao: novaDescricao,
        imagemUrl: novaImagem || "/img/icones/devWeb.png", // Usa o que você digitou ou o padrão
        linkGithub: novoLink || "https://github.com/gustavotinelvf" // Usa o seu link ou o perfil geral
      });

      // Se o Java salvou, adicionamos o novo projeto na lista da tela na hora
      setProjetos([...projetos, response.data]);
      
      // Limpamos todos os campos do formulário após o sucesso
      setNovoTitulo('');
      setNovaDescricao('');
      setNovoLink('');
      setNovaImagem('');
      
      console.log("Projeto cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao cadastrar projeto:", err);
      alert("Não foi possível cadastrar. Verifique a conexão com o Java.");
    }
  };

  // --- FUNÇÃO DE EXCLUSÃO REAL (CONEXÃO COM O JAVA) ---
  const handleExcluir = async (id, titulo) => {
    // 1. Perguntamos para o Gustavo se ele tem certeza (Segurança simples)
    if (window.confirm(`Tem certeza que deseja deletar o projeto "${titulo}"?`)) {
      try {
        // 2. Chamamos o Java usando o método DELETE e passando o ID na URL
        // A nossa 'api' já envia o Token JWT automaticamente no cabeçalho
        await api.delete(`/api/projetos/${id}`);

        // 3. Se chegou aqui, o Java deletou no banco com sucesso!
        // Agora atualizamos a lista na memória do React para o projeto sumir da tela
        const listaAtualizada = projetos.filter(p => p.id !== id);
        setProjetos(listaAtualizada);
        
        console.log(`Projeto ${id} removido com sucesso.`);
      } catch (err) {
        console.error("Erro ao excluir projeto:", err);
        alert("Ops! Não consegui excluir. Verifique se o servidor está on-line.");
      }
    }
  };

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
              <div className="container" style={{ minHeight: '80vh', padding: '40px 20px' }}>
                <h2 className="section-title">Painel de Controle</h2>
                
                {/* --- FORMULÁRIO DE CADASTRO COMPLETO --- */}
                <form onSubmit={handleCadastrar} style={{ marginBottom: '40px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>Cadastrar Novo Projeto</h3>
                  
                  {/* Primeira linha: Título e Link */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Título do Projeto" 
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      required
                      style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Link do GitHub (https://...)" 
                      value={novoLink}
                      onChange={(e) => setNovoLink(e.target.value)}
                      required
                      style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    />
                  </div>

                  {/* Segunda linha: Descrição e Caminho da Imagem */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Descrição breve (ex: Feito em Java/React)" 
                      value={novaDescricao}
                      onChange={(e) => setNovaDescricao(e.target.value)}
                      required
                      style={{ flex: '2', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Caminho da Imagem (ex: /img/icones/nave.png)" 
                      value={novaImagem}
                      onChange={(e) => setNovaImagem(e.target.value)}
                      required
                      style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    />
                    <button type="submit" className="btn-login" style={{ width: 'auto', padding: '10px 20px' }}>Salvar</button>
                  </div>
                </form>

                <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px'}}>
                  Bem-vindo, Gustavo. Aqui você gerencia seus projetos da UFS e do GitHub.
                </p>

                {/* --- TABELA DE GESTÃO --- */}
                <div style={{ overflowX: 'auto', backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--primary-color)', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Projeto</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projetos.map(proj => (
                        <tr key={proj.id} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ padding: '12px' }}>{proj.titulo}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button 
                              style={{ 
                                backgroundColor: '#e74c3c', 
                                color: 'white', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                              onClick={() => handleExcluir(proj.id, proj.titulo)}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Botão de Logout para garantir que só você entre e saia quando quiser */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <button 
                    onClick={handleLogout}
                    className="btn-login"
                    style={{ backgroundColor: '#555', maxWidth: '200px' }}
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
  // Organizado com Router e o conteúdo que gerencia las rotas
  return (
    <Router>
      <AppContent 
        projetos={projetos} 
        setProjetos={setProjetos}
        loading={loading} 
        error={error} 
        HomePage={HomePage} 
      />
    </Router>
  )
}

export default App