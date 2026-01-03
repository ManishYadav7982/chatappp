import { useChatStore } from "../store/usechatStore.js";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 mb-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
          activeTab === "chats" 
            ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
        }`}
      >
        CHATS
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
          activeTab === "contacts" 
            ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
        }`}
      >
        CONTACTS
      </button>
    </div>
  );
}
export default ActiveTabSwitch;