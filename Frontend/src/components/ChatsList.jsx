import { useEffect } from "react";
import { useChatStore } from "../store/usechatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-1">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
            selectedUser?._id === chat._id 
              ? "bg-cyan-500/15 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
              : "hover:bg-slate-800/40 border border-transparent"
          }`}
        >
          <div className="relative">
            <div className={`size-12 rounded-full ring-2 ring-offset-2 ring-offset-slate-950 transition-all ${onlineUsers.includes(chat._id) ? "ring-cyan-500" : "ring-slate-800"}`}>
              <img src={chat.profilePic || "/avatar.png"} className="size-full rounded-full object-cover" alt="" />
            </div>
            {onlineUsers.includes(chat._id) && (
              <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate transition-colors ${selectedUser?._id === chat._id ? "text-cyan-400" : "text-slate-200"}`}>
              {chat.fullname}
            </h4>
            <p className="text-xs text-slate-500 truncate">Online</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default ChatsList;