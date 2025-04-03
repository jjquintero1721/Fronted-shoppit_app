import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Error from "../ui/Error";
import "./LoginPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    state: "",
    role: "user"  // Por defecto es 'user'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    // Preparar los datos para enviar (sin confirmPassword)
    const registerData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      role: formData.role
    };
    
    // Enviar solicitud de registro
    api.post("register/", registerData)
      .then(res => {
        setSuccess(res.data.success);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          phone: "",
          city: "",
          state: "",
          role: "user"
        });
        setLoading(false);
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(err => {
        if (err.response?.status === 400) {
          setError(err.response.data?.error || "Por favor, verifica tu información e intenta nuevamente.");
        } else if (err.message.includes("Network Error")) {
          setError("No se puede conectar con el servidor. Por favor, verifica tu conexión a internet.");
        } else {
          setError("Error al registrarse. Por favor, intenta nuevamente o contacta con soporte.");
        }
        
        setLoading(false);
      })
  };
  
  return (
    <div className="login-container my-5">
      <div className="login-card shadow">
        {error && <Error error={error} />}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        
        <h2 className="login-title">Crear Nueva Cuenta</h2>
        <p className="login-subtitle">Únete a AIAG Shop</p>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="username" className="form-label">Nombre de usuario*</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Elige un nombre de usuario"
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email*</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Introduce tu email"
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="first_name" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Introduce tu nombre"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label">Apellidos</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Introduce tus apellidos"
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="city" className="form-label">Ciudad</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Introduce tu ciudad"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="state" className="form-label">Estado/Provincia</label>
              <input
                type="text"
                className="form-control"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Introduce tu estado/provincia"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Introduce tu número de teléfono"
            />
          </div>
          
          {/* Campo de selección de rol */}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Tipo de cuenta*</label>
            <select
              className="form-control"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Usuario normal (Solo compras)</option>
              <option value="vendor">Vendedor (Compras y ventas)</option>
            </select>
            <small className="form-text text-muted">
              Selecciona "Vendedor" si quieres vender productos en nuestra plataforma.
            </small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña*</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crea una contraseña"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña*</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>
        
        <div className="login-footer text-center mt-3">
          <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;