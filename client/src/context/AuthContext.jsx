import { Children, createContext, useContext, useEffect, useState } from "react";
import {registerUser, loginUser, fetchCurrentUser} from "../api/auth.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "breeze_token";
const USER_KEY = "breeze_user";

export const AuthProvider = ({children}) => {
    const [token, setToke] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    const persistSession = (nextToken, nextUser) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem(TOKEN_KEY, nextToken);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };
}