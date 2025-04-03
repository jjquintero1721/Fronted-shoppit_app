// src/components/user/RegisterPage.jsx
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
    role: "user" // Default role
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
    
    // Validate that the passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    // Prepare the data to send (without confirmPassword)
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
    
    // Send registration request
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
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(err => {
        if (err.response?.status === 400) {
          if (err.response.data?.error?.includes("Username already exists")) {
            setError("Este nombre de usuario ya está en uso. Por favor elige otro diferente.");
          } else if (err.response.data?.error?.includes("Email already in use")) {
            setError("Este correo electrónico ya está registrado. Por favor usa uno diferente o inicia sesión con tu cuenta.");
          } else {
            setError(err.response.data?.error || "Por favor revisa tu información e intenta de nuevo.");
          }
        } else if (err.message.includes("Network Error")) {
          setError("No se pudo conectar con el servidor. Por favor revisa tu conexión a internet.");
        } else {
          setError("Falló el registro. Por favor intenta de nuevo o contacta con soporte si el problema persiste.");
        }
        
        setLoading(false);
      });
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
        <p className="login-subtitle">Regístrate en A.I.A.G</p>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="username" className="form-label">Usuario*</label>
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
                placeholder="Ingresa tu email"
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
                placeholder="Ingresa tu nombre"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Ingresa tu apellido"
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
                placeholder="Ingresa tu ciudad"
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
                placeholder="Ingresa tu estado o provincia"
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
              placeholder="Ingresa tu número de teléfono"
            />
          </div>
          
          {/* Role selection */}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Tipo de Cuenta*</label>
            <select
              className="form-control"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Usuario Regular</option>
              <option value="seller">Vendedor</option>
            </select>
            <small className="text-muted">
              Los vendedores pueden publicar productos para venta después de la aprobación del administrador.
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
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña*</label>
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
            {loading ? "Creando Cuenta..." : "Registrarse"}
          </button>
        </form>
        
        <div className="login-footer text-center mt-3">
          <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;