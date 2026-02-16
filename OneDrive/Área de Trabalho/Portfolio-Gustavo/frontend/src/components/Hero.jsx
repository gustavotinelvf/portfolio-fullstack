import './Hero.css'

function Hero() {
    return (
        <section className="hero-container">
            <div className="hero-content">
                <span className="greeting">Olá, eu sou o Gustavo Tínel!</span>
                
                {/* Título com destaque colorido */}
                <h1 className="title">
                    Desenvolvedor <span className="highlight">Full Stack</span>
                </h1>
                
                <p className="subtitle">
                    Estudante de Ciência da Computação na UFS. <br/>
                    Focando em criar soluções escaláveis com Java Spring Boot e React.
                </p>
                
                <div className="hero-actions">
                    <a href="https://linkedin.com/in/gustavotinel" target="_blank" className="btn-primary">
                        Meu LinkedIn
                    </a>
                    <a href="#projetos" className="btn-secondary">
                        Ver Projetos
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Hero