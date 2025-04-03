// src/context/AuthContext.jsx
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import api from "../api";

// Crear el contexto con un valor predeterminado
const AuthContext = createContext({
    isAuthenticated: false,
    username: "",
    userRole: "user",
    isAdmin: false,
    isVendor: false,
    setIsAuthenticated: () => {},
    get_username: () => {}
});

// Separar el Provider como un componente independiente
function AuthProvider({children}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [userRole, setUserRole] = useState("user");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVendor, setIsVendor] = useState(false);

    const handleAuth = () => {
        const token = localStorage.getItem("access");
        if(token){
            const decoded = jwtDecode(token);
            const expiry_date = decoded.exp;
            const current_time = Date.now() / 1000;
            if(expiry_date >= current_time){
                setIsAuthenticated(true);
            }
        }
    };

    function get_username(){
        api.get("get_username")
        .then(res => {
            setUsername(res.data.username);
            
            // También obtener el rol del usuario
            api.get("user_info")
            .then(userInfo => {
                // Comprobar si es admin
                if (userInfo.data.is_staff) {
                    setUserRole("admin");
                    setIsAdmin(true);
                    setIsVendor(false);
                } 
                // Comprobar si es vendedor
                else if (userInfo.data.role === "vendor") {
                    setUserRole("vendor");
                    setIsVendor(true);
                    setIsAdmin(false);
                } 
                // Por defecto es usuario normal
                else {
                    setUserRole("user");
                    setIsVendor(false);
                    setIsAdmin(false);
                }
            })
            .catch(err => {
                console.log(err.message);
            });
        })
        .catch(err => {
            console.log(err.message);
        });
    }

    useEffect(function(){
        handleAuth();
        if (isAuthenticated) {
            get_username();
        }
    }, [isAuthenticated]);

    const authValue = {
        isAuthenticated, 
        username, 
        userRole,
        isAdmin,
        isVendor,
        setIsAuthenticated, 
        get_username
    };  

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Exportar el contexto y el provider separadamente
export { AuthContext, AuthProvider };