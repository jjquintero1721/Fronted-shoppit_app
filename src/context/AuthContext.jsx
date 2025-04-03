// src/context/AuthContext.jsx
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import api from "../api";

// Create the context with default values
const AuthContext = createContext({
    isAuthenticated: false,
    username: "",
    userRole: "",
    isAdmin: false,
    isLoading: true,
    setIsAuthenticated: () => {},
    get_username: () => {}
});

// Separate Provider component
function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [userRole, setUserRole] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleAuth = () => {
        const token = localStorage.getItem("access");
        if (token) {
            const decoded = jwtDecode(token);
            const expiry_date = decoded.exp;
            const current_time = Date.now() / 1000;
            if (expiry_date >= current_time) {
                setIsAuthenticated(true);
                getUserInfo();
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    function get_username() {
        api.get("get_username")
            .then(res => {
                setUsername(res.data.username);
            })
            .catch(err => {
                console.log(err.message);
            });
    }
    
    function getUserInfo() {
        api.get("user_info")
            .then(res => {
                setUsername(res.data.username);
                setUserRole(res.data.role);
                setIsAdmin(res.data.is_staff);
                setIsLoading(false);
            })
            .catch(err => {
                console.log("Error getting user info:", err.message);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        handleAuth();
    }, []);

    const authValue = {
        isAuthenticated,
        username,
        userRole,
        isAdmin,
        isLoading,
        setIsAuthenticated,
        get_username
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Export the context and provider separately
export { AuthContext, AuthProvider };