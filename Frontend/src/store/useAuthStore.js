import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "/";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,

      socket: null,
      onlineUsers: [],

      // 🔹 CHECK AUTH
      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
          get().connectSocket();
        } catch {
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      // 🔹 SIGNUP
      Signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Signup successful!");
          get().connectSocket();
        } finally {
          set({ isSigningUp: false });
        }
      },

      // 🔹 LOGIN
      Login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Login successful!");
          get().connectSocket();
        } finally {
          set({ isLoggingIn: false });
        }
      },

      // 🔹 LOGOUT
      logout: async () => {
        await axiosInstance.post("/auth/logout");
        get().disconnectSocket();
        set({ authUser: null, onlineUsers: [] });
        localStorage.removeItem("auth-storage");
      },

      // 🔹 UPDATE PROFILE (profilePic safe)
      updateProfile: async (data) => {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated");
      },

      // 🔹 SOCKET CONNECT
      connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(BASE_URL, {
          withCredentials: true,
          query: { userId: authUser._id },
        });

        newSocket.on("getOnlineUsers", (users) => {
          set({ onlineUsers: users });
        });

        set({ socket: newSocket });
      },

      // 🔹 SOCKET DISCONNECT
      disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) socket.disconnect();
        set({ socket: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser, // ✅ only persist authUser
      }),
    }
  )
);
