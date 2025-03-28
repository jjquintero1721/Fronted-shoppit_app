import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Error from "../ui/Error";
import "./LoginPage.css"; // Reutilizamos el mismo CSS del login

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
    city: "",     // Añadido campo de ciudad
    state: ""     // Añadido campo de estado
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
      setError("Passwords do not match");
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
      city: formData.city,       // Añadido al objeto de datos
      state: formData.state      // Añadido al objeto de datos
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
          state: ""
        });
        setLoading(false);
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(err => {
        if (err.response?.status === 400) {
          if (err.response.data?.error?.includes("Username already exists")) {
            setError("This username is already taken. Please choose a different one.");
          } else if (err.response.data?.error?.includes("Email already in use")) {
            setError("This email address is already registered. Please use a different email or login to your account.");
          } else {
            setError(err.response.data?.error || "Please check your information and try again.");
          }
        } else if (err.message.includes("Network Error")) {
          setError("Unable to connect to the server. Please check your internet connection and try again.");
        } else {
          setError("Registration failed. Please try again or contact support if the problem persists.");
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
        <p className="login-subtitle">Ingresar a A.I.A.G</p>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="username" className="form-label">Username*</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
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
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="first_name" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          {/* Nuevos campos para ciudad y estado */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="state" className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password*</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        
        <div className="login-footer text-center mt-3">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;