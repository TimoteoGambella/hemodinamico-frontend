import './style.css'

const NotFound = () => {
  return (
    <section className="container">
        <div className="box">
          <h2 className="title">
            404
          </h2>
          <p className="text-bold">
            Lo siento, no pudimos encontrar la página que buscas.
          </p>
          <p className="text">
            Pero no te preocupes, puedes encontrar un montón de cosas interesantes en nuestra página de inicio.
          </p>
          <a
            rel="noopener noreferrer"
            href="/"
            className="button"
          >
            Regresar a la página de inicio
          </a>
        </div>
    </section>
  )
}

export default NotFound
