import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/usechatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // 🔹 Load messages when user changes
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  // 🔹 Auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
  const isMe =
    String(msg.receiverId) === String(selectedUser._id);

  return (
    <div
      key={msg._id}
      className={`chat ${isMe ? "chat-end" : "chat-start"}`}
    >
      <div
        className={`chat-bubble ${
          isMe
            ? "bg-cyan-600 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >
        {msg.image && (
          <img
            src={msg.image}
            alt="Shared"
            className="rounded-lg h-48 object-cover"
          />
        )}

        {msg.text && <p className="mt-2">{msg.text}</p>}

        <p className="text-xs mt-1 opacity-75">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
})}

            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullname} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
