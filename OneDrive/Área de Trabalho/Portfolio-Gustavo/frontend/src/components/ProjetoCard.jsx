import './ProjetoCard.css'

// o omponente recebe um "prop" chamada 'projeto' contendo os dados
function ProjetoCard({ projeto }){
    return(
        <div className = "card">
            {/* Se tiver imagem, mostra. Se não, mostra uma cor padrão */}
            <div className = "card-image">
                <img
                    src = {projeto.imagemUrl || "https://via.placeholder.com/300x150?text=Projeto+Java"}
                    alt = {projeto.titulo}
                />
            </div>
            <div className = "card-content">
                <h3>{projeto.titulo}</h3>
                <p>{projeto.descricao}</p>

                <div className = "card-actions">
                    <a href = {projeto.linkGithub}  target = "_blank" rel = "noopener noreferrer" className = "btn-github">
                        Ver no GitHub
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProjetoCard