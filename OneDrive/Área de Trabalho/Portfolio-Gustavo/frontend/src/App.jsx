import {useState, useEffect} from 'react';
import axios from 'axios';
import ProjetoCard from './components/ProjetoCard';
import './App.css'

function App() {

  //1. Estado (memória do componente)
  // 'projetos' é a variável que guarda a lista
  // 'setProjetos' é a função que usamos para atualizar essa lista
  // começa com um array vazio []
  const [projetos, setProjetos] = useState([]);

  //2. Efeito (o que acontece quando o componente aparece na tela)
  // O useEffect roda assim que o componente aparece na tela
  useEffect(() =>{
    // busca o backend java
    axios.get('http://localhost:8080/api/projetos')
      .then(resposta => setProjetos(resposta.data))
      .catch(erro => console.error("Erro:", erro))
  }, [])

  return (
    <div className="container">
      <header className="header">
        <h1>Meu Portfólio Full Stack</h1>
        <p>Desenvolvido com Java Spring Boot & React</p>
      </header>

      <main className="projects-grid">
        {/* Aqui está a mágica: Para cada projeto, criamos um <ProjetoCard /> */}
        {projetos.map(projeto => (
          <ProjetoCard key={projeto.id} projeto={projeto} />
        ))}
      </main>
    </div>
  )
}

export default App