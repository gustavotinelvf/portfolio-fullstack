import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth'; // função que checa o token

/**
 * COMPONENTE DE ROTA PRIVADA
 * Ele funciona como um "envelope":
 * Se estiver logado, mostra o conteúdo
 * Se não, redireciona para a tela de login
 */
const PrivateRoute = ({ children }) => {
    // 1. Usamos a lógica que criamos no auth.js para ver se o token
    const logado = isAuthenticated();

    // 2. Se NÃO estiver logado, usamos o <Navigate /> para expulsar o usuário
    // O atributo "replace" apaga a tentativa de acesso do histórico do navegador
    if(!logado){
        return <Navigate to = "/login" replace />
    }

    // 3. Se estiver logado, renderiza a página administrativa normalmente
    return children;
};

export default PrivateRoute;