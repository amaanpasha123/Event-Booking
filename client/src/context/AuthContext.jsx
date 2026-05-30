import React, { createContext, useState, useEffect } from "react";
import api from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= LOAD USER FROM LOCAL STORAGE =================
    // On app startup, restore user session from localStorage if it exists
    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }

        setLoading(false);
    }, []);

    // ================= LOGIN =================
    // Authenticates user (any role) and stores token + user info in localStorage
    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", {
                email,
                password
            });

            // Save user object (includes role) to state and localStorage
            setUser(data.user);
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return data;

        } catch (error) {
            throw (
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    // ================= NORMAL USER REGISTER =================
    // Registers a normal user — hits /auth/register which hardcodes role: "user" in DB
    // ✅ FIXED: was incorrectly calling /auth/register-organizer before
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", {  // ✅ correct endpoint
                name,
                email,
                password
            });

            return data;

        } catch (error) {
            throw (
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Registration failed"
            );
        }
    };

    // ================= ORGANIZER REGISTER =================
    // Registers an organizer — hits /auth/register-organizer which hardcodes role: "organizer" in DB
    // ✅ FIXED: was incorrectly calling /auth/register before
    const registerOrganizer = async (
        name,
        email,
        password,
        company = ""
    ) => {
        try {
            const { data } = await api.post("/auth/register-organizer", {  // ✅ correct endpoint
                name,
                email,
                password,
                company
            });

            return data;

        } catch (error) {
            throw (
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Organizer registration failed"
            );
        }
    };

    // ================= VERIFY OTP =================
    // Verifies the OTP sent to email after registration
    // On success, stores the verified user (with correct role) in state and localStorage
    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post("/auth/verify", {
                email,
                otp
            });

            // Save verified user object (includes role) to state and localStorage
            setUser(data.user);
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return data;

        } catch (error) {
            throw (
                error.response?.data?.error ||
                error.response?.data?.message ||
                "OTP verification failed"
            );
        }
    };

    // ================= LOGOUT =================
    // Clears user session from state and localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                registerOrganizer,
                verifyOTP,
                logout
            }}
        >
            {/* Don't render children until auth state is restored from localStorage */}
            {!loading && children}
        </AuthContext.Provider>
    );
};