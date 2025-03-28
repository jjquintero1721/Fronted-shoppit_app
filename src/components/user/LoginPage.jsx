import { useContext, useState } from "react"
import "./LoginPage.css"
import api from "../../api"
import Error from "../ui/Error"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"

const LoginPage = () => {

  const {setIsAuthenticated, get_username} = useContext(AuthContext)

  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const userInfo = {username, password}

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    api.post("token/", userInfo )
    .then(res => {
      console.log(res.data)
      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
      setUsername("")
      setPassword("")
      setLoading(false)
      setIsAuthenticated(true)
      get_username()
      setError("")

      const from = location?.state?.from.pathname || "/";
      navigate(from, {replace:true});
    })
    .catch(err => {
      console.log(err.message);
      
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos. Porfavor compruebalos y intenta de nuevo.");
      } else if (err.response?.status === 404) {
        setError("Cuenta no encontrada. Porfavor verifica tu usuario o crea una nueva cuenta.");
      } else if (err.response?.status === 429) {
        setError("Demaciados intentos. Intenta de nuevo mas tarde.");
      } else if (err.message.includes("Network Error")) {
        setError("No es posible conectarse con el servidor. Porfavor revisa tu conexion a internet.");
      } else {
        setError("inicio de sesion fallido. Porfavor intenta de nuevo mas tarde o contactate con el soporte tecnico.");
      }
      
      setLoading(false);
    })
  }

  return (
    <div className="login-container my-5">
      <div className="login-card shadow">
        {error && <Error error={error} /> }
        <h2 className="login-title">Bienvenido de Vuelta</h2>
        <p className="login-subtitle">Porfavor ingresa con tu cuenta</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input type="username" value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="form-control" id="email" placeholder="Ingresa tu usuario" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control" id="password" placeholder="Ingresa tu contraseña" required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>Login</button>
        </form>
        <div className="login-footer">
          <p><a href="#">Olvidastes tu contraseña?</a></p>
          <p>no tines cuenta? <Link to="/register">Registrate</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage