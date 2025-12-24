import { create } from "zustand";

export const useAuthStore = create((set ) => ({
    authUser: {name : "name " , _id : 112 , age : 20} ,
    isLoading :false,

    login: () => {
        console.log("login called");
    },

    logout: () => {
        console.log("logout called");
    },
    
    setAuthUser: (user) => set({ authUser: user }),

    setIsLoading: (loading) => set({ isLoading: loading }),
}));
