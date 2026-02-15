// frontend/src/components/Skills.jsx
import './Skills.css'

function Skills() {
    // Lista de dados (Array) com minhas habilidades.
    // Assim fica fácil adicionar ou remover coisas sem mexer no HTML.
    const skills = [
        // Tech Stack
        { nome: "Java", nivel: "Básico/Interm", tipo: "tech" },
        { nome: "Spring Boot", nivel: "Básico", tipo: "tech" },
        { nome: "HTML/CSS/JS", nivel: "Básico/Interm", tipo: "tech" },
        { nome: "React", nivel: "Básico", tipo: "tech" },
        { nome: "SQL", nivel: "Básico", tipo: "tech" },
        { nome: "Git", nivel: "Essencial", tipo: "tech" },
        
        // Idiomas
        { nome: "Inglês", nivel: "Avançado (C1/C2)", tipo: "lang" },
        { nome: "Português", nivel: "Nativo", tipo: "lang" },
        { nome: "Espanhol", nivel: "Básico", tipo: "lang" },
    ]

    return (
        <section className="skills-container">
            <h2 className="skills-title">Habilidades & Idiomas</h2>
            
            {/* Grid flexível que se adapta se tiver muitos itens */}
            <div className="skills-grid">
                
                {/* Aqui uso o .map para percorrer minha lista de skills e criar um card para cada uma */}
                {skills.map((skill, index) => (
                    <div key={index} className={`skill-card ${skill.tipo}`}>
                        {/* Nome da habilidade */}
                        <span className="skill-name">{skill.nome}</span>
                        
                        {/* Badge (etiqueta) mostrando o nível */}
                        <div className="skill-level-badge">
                            {skill.nivel}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Skills