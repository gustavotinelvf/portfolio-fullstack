// 1. Pacote: é a organização do código em pastas, para manter tudo organizado
package com.gustavo.portfolio.controller;

//2. Importações
// preciso trazer as ferramentas da biblioteca do Spring Web para poder usar
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//3. anotação de classe (@RestController) para indicar que esta classe é um controlador REST
// Ela é um controlador web responsável por responder as requisições REST
// O "Rest" significa que ela vai devolver DADOS (texto, JSON) e não uma página HTML completa
@RestController

//4. Roteamento base (@RequestMapping):
// Define o prefixo do endereço. Tudo que estiver dentro dessa classe
// só vai ser acessado se a URL começar com "/api"
// é ótimo para organizar "/api" de /imagens ou /admin
@RequestMapping("/api")

public class HelloController{
    
    // 5. mapeamento do método (@GetMapping):
    // O navegador, quando digita um link e dá enter, faz uma requisição do tipo "GET"
    // Aqui dizemos: "quando chegar um GET no endereço '/hello-world', rode este método"
    // a URL final vira a soma das duas: localhost:8080/api/hello-world
    @GetMapping("/hello-world")
    public String helloWorld(){
        // 6. resposta do método:
        // O que esse método vai devolver quando for chamado?
        // Ele vai devolver um texto simples: "Hello World!"
        return "Olá, Mundo! O Backend está online e funcionando!";
    }
}


