import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css'

function App() {

  //1. Estado (memória do componente)
  // 'projetos' é a variável que guarda a lista
  // 'setProjetos' é a função que usamos para atualizar essa lista
  // começa com um array vazio []
  const [projetos, setProjetos] = useState([]);

  //2. Efeito (o que acontece quando o componente aparece na tela)
  // O useEffect roda assim que o componente aparece na tela
  useEffect(() => {
    // chama o backend (Java)
    axios.get('http://localhost:8080/api/projetos')
      .then(resposta => {
        // se der certo, guarda os dados na memória (estado)
        setProjetos(resposta.data);
      })
      .catch(erro => {
        // se der erro, mostra no console
        console.error("Erro ao buscar projetos:", erro)
      })
  }, []) // Esse [] vazio significa que o efeito roda só uma vez, quando o componente aparece

  // 3. Renderização (HTML que vai pra tela)
  return (
    <div style={{ padding: '20px'}}>
      <h1>Meus Projetos</h1>

      {/*se a lista estiver vazia, avisa*/}
      {projetos.length === 0 ? (
        <p>Carregando ou sem projetos...</p>
      ) : (
        /*Mapeia cada projeto do Java para um pedaço de <HTML>*/
        <ul>
          {projetos.map(projeto => (
            <li key={projeto.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{projeto.titulo}</h3>
              <p>{projeto.descricao}</p>
              <a href={projeto.linkGitHub} target="_blank">Ver no GitHub</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App