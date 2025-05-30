import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    // Set default axios header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, [token, API_BASE_URL]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password
            });

            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name,
                email,
                password
            });

            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
