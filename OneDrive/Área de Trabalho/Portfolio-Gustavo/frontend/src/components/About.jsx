// frontend/src/components/About.jsx
import './About.css'

function About() {
    return (
        // Seção container que abraça todo o conteúdo "Sobre Mim"
        <section className="about-container">
            <div className="about-content">
                
                {/* --- LADO ESQUERDO: Minha Foto --- */}
                <div className="about-image">
                    {/* Aqui eu puxo minha foto do GitHub. 
                        Se der erro, o 'onError' coloca uma imagem genérica. */}
                    <img 
                        src="/img/Perfil/minha-foto.jpeg" 
                        alt="Foto de Gustavo Tínel" 
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x300?text=G'}
                    />
                </div>

                {/* --- LADO DIREITO: Minha História --- */}
                <div className="about-text">
                    <h2 className="about-title">Sobre <span className="highlight">Mim</span></h2>
                    
                    {/* Parágrafo 1: Introdução Acadêmica */}
                    <p>
                        Sou estudante de <strong>Ciência da Computação na UFS</strong> (Universidade Federal de Sergipe). 
                        Sempre fui apaixonado por tecnologia desde pequeno, e com isso minha jornada na programação começou com a curiosidade de entender como as coisas funcionam por trás das telas.
                    </p>
                    
                    {/* Parágrafo 2: Foco Profissional */}
                    <p>
                        Hoje, meu foco é o desenvolvimento <strong>Full Stack</strong>. Gosto de criar sistemas robustos no Backend com 
                        <strong> Java (Spring Boot)</strong> e interfaces modernas no Frontend com <strong>React</strong>.
                    </p>

                    {/* Parágrafo 3: Pessoal/Hobbies */}
                    <p>
                        Quando não estou codando ou estudando, você provavelmente vai me encontrar 
                        jogando ou na academia.
                    </p>

                    {/* Cards de estatísticas estilo "Status de RPG" */}
                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number">1+</span>
                            <span className="stat-label">Anos de Estudo</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">5+</span>
                            <span className="stat-label">Projetos Criados</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About