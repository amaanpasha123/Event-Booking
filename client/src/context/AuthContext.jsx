import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    // ================= LOGIN =================
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data.user);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw error.response?.data?.error
            || error.response?.data?.message
            || 'Login failed';
        }
    };

    // ================= REGISTER =================
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return data;
        } catch (error) {
            throw error.response?.data?.message
            || error.response?.data?.error
            || 'Registration failed';
        }
    };

    // ================= VERIFY OTP =================
    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify', { email, otp });
            setUser(data.user);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw error.response?.data?.error
            || error.response?.data?.message
            || 'OTP verification failed';
        }
    };

    // ================= LOGOUT =================
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyOTP, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};