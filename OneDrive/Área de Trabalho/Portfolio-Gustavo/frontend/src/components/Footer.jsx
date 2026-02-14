import './Footer.css'

function Footer(){
    return (
        <footer className = "footer">
            <div className = "footer-content">
                <p>&copy; 2026 Gustavo. Desenvolvido com ☕e código </p>
                <div className = "social-links">
                    <a href = "https://github.com/gustavotinelvf" target = "_blank" rel = "noopener noreferrer">GitHub</a>
                    <a href = "https://www.linkedin.com/in/gustavotinel/" target = "_blank" rel = "noopener noreferrer">LinkedIn</a>
                    <a href = "mailto:gustavotinel.pro@gmail.com">Email</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer