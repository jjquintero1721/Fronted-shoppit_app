import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import api from "../api";

// Crear el contexto con un valor predeterminado
const AuthContext = createContext({
    isAuthenticated: false,
    username: "",
    setIsAuthenticated: () => {},
    get_username: () => {}
});

// Separar el Provider como un componente independiente
function AuthProvider({children}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");

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
        .then(res =>{
            setUsername(res.data.username);
        })
        .catch(err =>{
            console.log(err.message);
        });
    }

    useEffect(function(){
        handleAuth();
        get_username();
    }, []);

    const authValue = {
        isAuthenticated, 
        username, 
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