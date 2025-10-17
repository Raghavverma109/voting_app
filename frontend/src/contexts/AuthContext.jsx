import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { saveAuth, clearAuth, getUser as getLocalUser, getToken } from '../utils/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            // Assuming you have a /profile route to get user data
            const { data } = await api.get('/user/profile'); 
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            clearAuth(); // Clear invalid auth data
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const login = async (credentials) => {
        const toastId = toast.loading('Logging in...');
        try {
            const { data } = await api.post('/user/login', credentials);
            saveAuth(data.token, data.user); // Save both token and user object
            setUser(data.user);
            toast.success('Logged in successfully!', { id: toastId });
            return true;
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Login failed', { id: toastId });
            return false;
        }
    };

    // ✅ --- MODIFIED SIGNUP FUNCTION ---
    const signup = async (userData) => {
        const toastId = toast.loading('Creating your account...');
        console.log("Signup data being sent......................... :", userData);
        try {
            // The userData object is already structured correctly by Signup.jsx.
            // We just pass it directly to the API endpoint.
            const { data } = await api.post('/user/signup', userData);

            // After a successful signup, log the user in immediately.
            saveAuth(data.token, data.user); // Save the new token and user object.
            setUser(data.user); // Update the user state in the context.
            
            toast.success('Account created successfully!', { id: toastId });
            return true;
        } catch (err) {
            // Display the specific validation error sent from the backend.
            toast.error(err?.response?.data?.error || 'Signup failed. Please check your details.', { id: toastId });
            console.error("Signup Error:", err.response?.data || err);
            return false;
        }
    };

    const logout = () => {
        clearAuth();
        setUser(null);
        toast.success('Logged out.');
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        refreshProfile: loadProfile // Expose a function to manually refresh profile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};