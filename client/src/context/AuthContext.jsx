import { Children, createContext, useContext, useEffect, useState } from "react";
import {registerUser, loginUser, fetchCurrentUser} from "../api/auth.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "breeze_token";
const USER_KEY = "breeze_user";

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
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

    // Confirm if any stored token is still valid and refresh the fields the server tracks
    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const data = await fetchCurrentUser(token);
                setUser((prev) => {
                    const merged = {
                        ...prev,
                        role: data.role,
                        recentSearchedCities: data.recentSearchedCities,
                    };
                    localStorage.setItem(USER_KEY, JSON.stringify(merged));
                    return merged;
                });
            } catch (error) {
                // if token is expired, invalid, or user no longer exists
                logout();
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, []);

    const login = async ({email, password}) => {
        const data = await loginUser({email, password});
        persistSession(data.token, data.user);
        return data.user;
    };

    const register = async ({email, password, username}) => {
        await registerUser({email, password, username});
        return login({email, password});
    };

    const value = {
        user,  token, isAuthenticated: Boolean(token && user), loading, login, register, logout,
    };

    return <AuthContext.Provider value = {value}> {children} </AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error ("useAuth must be used within an AuthProvider");
    return ctx;
};