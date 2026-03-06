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

/**
 * AJUSTE DE IMPORT (CORREÇÃO DA TELA PRETA):
 * Alterado de caminho absoluto para relativo para que o Vite localize o arquivo na pasta components.
 */
import PrivateRoute from './components/PrivateRoute'

// Importando a função de logout para limpar o token do navegador
import { logout } from './services/auth'
// importar nossa API com o interceptor de Token (preparado para o DELETE futuro)
import api from './services/api';


// Importando o estilo global
import './App.css'

// --- COMPONENTE HOMEPAGE (MOVIDO PARA FORA PARA EVITAR PERDA DE FOCO NA BUSCA) ---
function HomePage({ projetos, loading, error, busca, setBusca }) {
  // --- LÓGICA DE FILTRAGEM ---
  // Filtra por Título, Linguagem ou Tipo conforme você digitar
  const projetosFiltrados = projetos.filter(projeto => {
    const termoBusca = busca.toLowerCase();
    return (
      projeto.titulo.toLowerCase().includes(termoBusca) ||
      (projeto.linguagem && projeto.linguagem.toLowerCase().includes(termoBusca)) ||
      (projeto.tipo && projeto.tipo.toLowerCase().includes(termoBusca))
    );
  });

  // Função auxiliar para definir a cor do selo conforme a linguagem
  const getBadgeStyle = (linguagem) => {
    switch(linguagem?.toLowerCase()) {
      case 'java': return { backgroundColor: '#f89820', color: 'white' };
      case 'c': return { backgroundColor: '#a8b9cc', color: 'black' };
      case 'js': case 'javascript': return { backgroundColor: '#f7df1e', color: 'black' };
      default: return { backgroundColor: 'var(--primary-color)', color: 'black' };
    }
  };

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <div className="container" id="projetos">
        <h2 className="section-title">Projetos Realizados</h2>

        {/* --- BARRA DE PESQUISA (FILTRO POR LINGUAGEM/TIPO) --- */}
        <div className="search-container" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <input 
            type="text" 
            placeholder="Pesquisar por Título, Linguagem (C, Java, JS) ou Tipo..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', maxWidth: '600px', padding: '12px', borderRadius: '25px', border: '1px solid #333', background: '#1a1a1a', color: 'white' }}
          />
        </div>

        {loading && (
            <div className="status-message">
                <div className="spinner"></div>
                <p>Carregando projetos do banco de dados...</p>
            </div>
        )}
        {error && (
            <div className="error-message">
                <p>⚠️ {error}</p>
            </div>
        )}
        {!loading && !error && (
            <main className="projects-grid">
              {/* Renderiza a lista filtrada em vez da lista completa */}
              {projetosFiltrados.length > 0 ? (
                projetosFiltrados.map(projeto => (
                  <div key={projeto.id} className="projeto-wrapper" style={{ position: 'relative' }}>
                    <ProjetoCard projeto={projeto} />
                    {/* Selos Visuais de Linguagem e Tipo */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                      {projeto.linguagem && (
                        <span style={{ ...getBadgeStyle(projeto.linguagem), padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                          {projeto.linguagem}
                        </span>
                      )}
                      {projeto.tipo && (
                        <span style={{ backgroundColor: '#333', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                          {projeto.tipo}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5 }}>
                  Nenhum projeto encontrado para sua busca.
                </p>
              )}
            </main>
        )}
      </div>
    </>
  );
}

// Criei este componente interno para podermos usar o hook useNavigate 
// sem dar erro de contexto do Router
function AppContent({ projetos, setProjetos, loading, error, busca, setBusca }) {
  const navigate = useNavigate();

  // --- ESTADOS PARA O FORMULÁRIO (CADASTRO E EDIÇÃO) ---
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoLink, setNovoLink] = useState('');
  const [novaImagem, setNovaImagem] = useState('');
  
  // --- NOVOS ESTADOS PARA CATEGORIAS ---
  const [novaLinguagem, setNovaLinguagem] = useState('');
  const [novoTipo, setNovoTipo] = useState('');

  // Controla se estamos editando (guarda o ID do projeto) ou criando (null)
  const [idSendoEditado, setIdSendoEditado] = useState(null);
  
  // estado para o toast
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' }); // o tipo é sucesso ou erro
  
  // Função para disparar o aviso
  const mostrarAviso = (texto, tipo = 'sucesso') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  }

  // --- FUNÇÃO PARA SALVAR (HÍBRIDA: POST OU PUT) ---
  const handleSalvar = async (e) => {
    e.preventDefault(); 
    
    const dadosProjeto = {
      titulo: novoTitulo,
      descricao: novaDescricao,
      imagemUrl: novaImagem || "/img/icones/devWeb.png",
      linkGithub: novoLink || "https://github.com/gustavotinelvf",
      linguagem: novaLinguagem || 'Outra',
      tipo: novoTipo || 'Web'
    };

    // LOG DE DEBUG: Verifique se isso aparece no console do navegador (F12)
    console.log("Enviando dados para o Java:", dadosProjeto);

    try {
      if (idSendoEditado) {
        const response = await api.put(`/api/projetos/${idSendoEditado}`, dadosProjeto);
        setProjetos(projetos.map(p => p.id === idSendoEditado ? response.data : p));
        mostrarAviso("Projeto atualizado com sucesso!", "sucesso");
      } else {
        const response = await api.post('/api/projetos', dadosProjeto);
        setProjetos([...projetos, response.data]);
        mostrarAviso("Projeto cadastrado com sucesso!", "sucesso");
      }
      limparFormulario();
    } catch (err) {
      /**
       * DEBUG AVANÇADO:
       * Se o Java der erro, ele vai imprimir aqui no console do F12 a resposta exata.
       * Se aparecer '403', é segurança. Se aparecer '400', é o nome dos campos (DTO).
       */
      console.error("Erro detalhado do servidor:", err.response?.data || err.message);
      
      const msgErro = err.response?.status === 403 
        ? "Erro 403: Tente deslogar e logar novamente para renovar o acesso." 
        : "Erro ao salvar: Verifique os campos do DTO no Java.";
        
      mostrarAviso(msgErro, "erro");
    }
  };

  // --- FUNÇÃO PARA PREPARAR A EDIÇÃO ---
  const prepararEdicao = (projeto) => {
    setIdSendoEditado(projeto.id);
    setNovoTitulo(projeto.titulo);
    setNovaDescricao(projeto.descricao);
    setNovoLink(projeto.linkGithub);
    setNovaImagem(projeto.imagemUrl);
    // Carregando os novos campos no formulário ao editar
    setNovaLinguagem(projeto.linguagem || '');
    setNovoTipo(projeto.tipo || '');
    // Faz o navegador rolar suavemente para o formulário no topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparFormulario = () => {
    setNovoTitulo('');
    setNovaDescricao('');
    setNovoLink('');
    setNovaImagem('');
    setNovaLinguagem('');
    setNovoTipo('');
    setIdSendoEditado(null);
  };

  // --- FUNÇÃO DE EXCLUSÃO REAL (CONEXÃO COM O JAVA) ---
  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja deletar o projeto "${titulo}"?`)) {
      try {
        await api.delete(`/api/projetos/${id}`);
        const listaAtualizada = projetos.filter(p => p.id !== id);
        setProjetos(listaAtualizada);
        mostrarAviso(`Projeto "${titulo}" removido!`, "sucesso");
      } catch (err) {
        console.error("Erro ao excluir projeto:", err);
        mostrarAviso("Erro de permissão para excluir.", "erro");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    console.log("Sessão encerrada.");
  };

  return (
    <div className="app-wrapper">
      {/* RENDERIZAÇÃO DO TOAST */}
      {mensagem.texto && (
        <div className={`toast-notification ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage projetos={projetos} loading={loading} error={error} busca={busca} setBusca={setBusca} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute>
              <div className="container" style={{ minHeight: '80vh', padding: '40px 20px' }}>
                <h2 className="section-title">Painel de Controle</h2>
                
                <form onSubmit={handleSalvar} style={{ marginBottom: '40px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: idSendoEditado ? '1px solid var(--primary-color)' : 'none' }}>
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>
                    {idSendoEditado ? 'Editando Projeto' : 'Cadastrar Novo Projeto'}
                  </h3>
                  
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

                  {/* AJUSTE: Campos de seleção para Linguagem e Tipo */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <select 
                      value={novaLinguagem} 
                      onChange={(e) => setNovaLinguagem(e.target.value)}
                      required
                      style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    >
                      <option value="">Linguagem Utilizada</option>
                      <option value="Java">Java</option>
                      <option value="C">C</option>
                      <option value="JS">JavaScript</option>
                      <option value="Outra">Outra</option>
                    </select>
                    
                    <select 
                      value={novoTipo} 
                      onChange={(e) => setNovoTipo(e.target.value)}
                      required
                      style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    >
                      <option value="">Tipo de Projeto</option>
                      <option value="Web">Aplicação Web</option>
                      <option value="Jogo">Jogo</option>
                      <option value="Portfolio">Portfólio</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Descrição breve" 
                      value={novaDescricao}
                      onChange={(e) => setNovaDescricao(e.target.value)}
                      required
                      style={{ flex: '2', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Caminho da Imagem" 
                      value={novaImagem}
                      onChange={(e) => setNovaImagem(e.target.value)}
                      required
                      style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: 'white' }}
                    />
                    <button type="submit" className="btn-login" style={{ width: 'auto', padding: '10px 20px' }}>
                      {idSendoEditado ? 'Atualizar' : 'Salvar'}
                    </button>
                    {idSendoEditado && (
                      <button type="button" onClick={limparFormulario} style={{ background: 'transparent', color: 'white', border: '1px solid #555', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px'}}>
                  Bem-vindo, Gustavo. Aqui você gerencia seus projetos da UFS e do GitHub.
                </p>

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
                          <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button 
                              style={{ backgroundColor: 'var(--primary-color)', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                              onClick={() => prepararEdicao(proj)}
                            >
                              Editar
                            </button>
                            <button 
                              style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
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
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <button onClick={handleLogout} className="btn-login" style={{ backgroundColor: '#555', maxWidth: '200px' }}>
                    Encerrar Sessão
                  </button>
                </div>
              </div>
          </PrivateRoute>
        } />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busca, setBusca] = useState('');

  useEffect(() => {
    api.get('/api/projetos')
      .then(resposta => {
        setProjetos(resposta.data)
        setLoading(false)
      })
      .catch(erro => {
        setError("Não consegui conectar ao servidor (Java). Verifique se o Backend está rodando.")
        setLoading(false)
      })
  }, [])

  return (
    <Router>
      <AppContent 
        projetos={projetos} 
        setProjetos={setProjetos}
        loading={loading} 
        error={error} 
        busca={busca}
        setBusca={setBusca}
      />
    </Router>
  )
}

export default App