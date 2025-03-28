import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <header className="py-3 my-5" style={{backgroundColor: "#6050DC"}}>
    <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
            <h1 className="display-4 fw-bold">Pagina no encontrada!</h1>
            <p className="lead fw-normal text-white-75 mb-4">La pagina a la que esta intentado ingresa no se encuentra</p>
            <Link to="/" className="btn btn-light btn-lg" href="/">Volver a casa</Link>
        </div>
    </div>
    </header>
  )
}

export default NotFoundPage
