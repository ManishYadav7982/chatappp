import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    checkAuth: async () => {

        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null });

        }
        finally {
            {
                set({ isCheckingAuth: false });
            }
        }
    },

    Signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('auth/signup', data);
            set({ authUser: res.data });
            toast.success("Signup successful!");
        } catch (error) {
            console.error("Error signing up:", error);
            toast.error(error.response?.data?.message || "Signup failed.");
            throw error;
        } finally {
            set({ isSigningUp: false });
        }
    },

    Login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("auth/login", data);
            set({ authUser: res.data });
            toast.success("Login successful!");
        } catch (error) {
            console.error("Error logging in:", error);
            toast.error(error.response?.data?.message || "Invalid credentials");
            throw error; // 🔥 THIS LINE FIXES EVERYTHING
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Logout failed");
        }
    },
}));

