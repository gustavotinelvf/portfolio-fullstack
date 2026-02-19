// chave que vamos usar para salvar o token no navegador
export const TOKEN_KEY = "portfolio-Token";

// 1. Verifica se existe um token salvo para saber se o user tá logado
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

// 2. Busca o token salvo para enviar nas requisições futuras
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// 3. Salva o token quando o login for bem sucedido
export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
}

// 4. Remove o token (logout)
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
}