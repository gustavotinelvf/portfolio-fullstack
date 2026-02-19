import axios from "axios";

// importa a função que busca o token no LocalStorage do navegador
import { getToken } from "./auth";

// 1. Criamos uma instância do Axios com a URL base do nosso java
const api = axios.create({
    baseURL: "http://localhost:8080"
});

// 2. Criams um "Interceptor"
// Ele funciona como uma medidad de segurança que vai conferir as requisições
// antes delas saírem do navegador para o servidor
api.interceptors.request.use(async config => {
    // buscamos o token que salvamos na hora do login
    const token = getToken();

    // Se o token existir, ou seja, se tiver logado
    if(token){
        // adicionamos o token no cabeçalho da requisição
        // "Bearer" é padrão exigido pelo JWT no Spring Security
        config.headers.Authorization = `Bearer ${token}`;
    }

    // retorna a configuração alterada para o Axios seguir com o envio
    return config;
});

export default api;