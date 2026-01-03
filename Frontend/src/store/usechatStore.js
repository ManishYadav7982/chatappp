import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { toast } from "react-hot-toast";

export const useChatStore = create(
  persist(
    (set, get) => ({
      // ---------------- STATE ----------------
      allContacts: [],
      chats: [],
      messages: [],

      activeTab: "chats",
      selectedUser: null,

      isUsersLoading: false,
      isMessagesLoading: false,

      isSoundEnabled:
        localStorage.getItem("soundEnabled") === null
          ? true
          : localStorage.getItem("soundEnabled") === "true",

      // ---------------- UI ACTIONS ----------------
      toggleSound: () =>
        set((state) => {
          const newValue = !state.isSoundEnabled;
          localStorage.setItem("soundEnabled", newValue);
          return { isSoundEnabled: newValue };
        }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setSelectedUser: (user) =>
        set({
          selectedUser: user,
          messages: [], // clear previous chat
        }),

      // ---------------- API CALLS ----------------
      getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("messages/contacts");
          set({
            allContacts: Array.isArray(res.data.users)
              ? res.data.users
              : [],
          });
        } catch {
          set({ allContacts: [] });
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/chats");
          set({
            chats: Array.isArray(res.data.chats)
              ? res.data.chats
              : [],
          });
        } catch {
          set({ chats: [] });
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data.messages || [] });
        } catch {
          toast.error("Failed to load messages");
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      sendMessage: async (messageData) => {
        const { selectedUser } = get();
        if (!selectedUser?._id) {
          toast.error("Please select a chat first");
          return;
        }

        const { authUser } = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
          _id: tempId,
          senderId: authUser._id,
          receiverId: selectedUser._id,
          text: messageData.text,
          image: messageData.image,
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        };

        set((state) => ({
          messages: [...state.messages, optimisticMessage],
        }));

        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData
          );

          set((state) => ({
            messages: state.messages.map((msg) =>
              msg._id === tempId ? res.data : msg
            ),
          }));
        } catch (error) {
          set((state) => ({
            messages: state.messages.filter((msg) => msg._id !== tempId),
          }));
          toast.error("Message failed");
        }
      },

      subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.on("newMessage", (newMessage) => {
          if (newMessage.senderId !== selectedUser._id) return;

          set((state) => ({
            messages: [...state.messages, newMessage],
          }));

          if (isSoundEnabled) {
            new Audio("/sounds/notification.mp3").play().catch(() => {});
          }
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
      },
    }),
    {
      name: "chat-storage", //  localStorage key
      partialize: (state) => ({
        selectedUser: state.selectedUser, // ✅ ONLY persist this
      }),
    }
  )
);
