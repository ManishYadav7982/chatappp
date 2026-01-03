import { useEffect } from "react";
import { useChatStore } from "../store/usechatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers } = useAuthStore(); // ❗ no UI change

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${
                Array.isArray(onlineUsers) &&
                onlineUsers.includes(contact._id)
                  ? "online"
                  : "offline"
              }`}
            >
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} />
              </div>
            </div>

            {/* ONLY data fix, no UI change */}
            <h4 className="text-slate-200 font-medium">
              {contact.fullname}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactList;
