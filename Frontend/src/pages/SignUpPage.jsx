import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  MessageSquare,
  Send,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MOCK AUTH STORE SIMULATION
 * (In your real app, you would use your actual useAuthStore)
 */
const useAuthStoreMock = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const Signup = async (data) => {
    setIsSigningUp(true);
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSigningUp(false);
    return { success: true };
  };

  return { Signup, isSigningUp };
};

const CHAT_MESSAGES = [
  { id: 1, sender: "Sarah", text: "Hey! Did you see the new update?", side: "left" },
  { id: 2, sender: "You", text: "Just saw it. The speed is insane! 🚀", side: "right" },
  { id: 3, sender: "Sarah", text: "Totally! Let's migrate the team today.", side: "left" },
  { id: 4, sender: "You", text: "On it. Setting up the workspace now.", side: "right" },
];

export default function App() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("form"); // form | success
  
  // Using the simulation store
  const { Signup, isSigningUp } = useAuthStoreMock();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Signup(formData);
      if (result.success) {
        setStep("success");
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[160px]" />
      </div>

      {/* Main Container - Scaled Dimensions (2.5x) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[2250px] h-auto max-h-[min(1600px,95vh)] bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        
        {/* Left Side: Chat Animation & Brand */}
        <div className="hidden md:flex md:w-[45%] p-12 lg:p-16 flex-col justify-between text-white relative border-r border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90">ChatFlow</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-12 text-white">
              The future of <br /> 
              <span className="text-indigo-400">messaging is here.</span>
            </h1>

            {/* Chat Simulation - Larger scaling for larger container */}
            <div className="space-y-6 max-w-[380px]">
              {CHAT_MESSAGES.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 + 0.3 }}
                  className={`flex flex-col ${msg.side === 'right' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-black mb-2 text-white/30 ml-1">
                    {msg.sender}
                  </span>
                  <div className={`px-5 py-3 rounded-2xl text-sm shadow-xl ${
                    msg.side === 'right' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/90 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl w-fit border border-white/5 shadow-inner"
              >
                <div className="w-2 h-2 bg-indigo-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-indigo-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-400/50 rounded-full animate-bounce" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-white/40">
            <Sparkles size={18} className="text-indigo-400" />
            <p className="text-xs font-black tracking-[0.2em] uppercase">
              Secure & Encrypted Communication
            </p>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 p-8 md:p-16 lg:p-24 relative flex flex-col justify-center overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-[440px] mx-auto w-full py-4"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-white mb-3">Join the circle</h2>
                  <p className="text-lg text-white/50 font-medium">Create your unique identity to start chatting.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Identity (Full Name)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        name="fullname"
                        required
                        placeholder="Alex Rivera"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all duration-300 text-base text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Secure Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="alex@chatflow.io"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all duration-300 text-base text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Access Key (Password)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-indigo-400 transition-colors">
                        <Lock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all duration-300 text-base text-white placeholder:text-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/20 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4.5 rounded-2xl shadow-2xl shadow-indigo-900/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-base uppercase tracking-widest"
                  >
                    {isSigningUp ? (
                      <>
                        <Loader2 className="animate-spin" size={22} />
                        <span>Initializing Node...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Community</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-12 text-center">
                  <p className="text-sm text-white/30 font-medium">
                    Already part of the network?{" "}
                    <button onClick={() => window.location.href = "/login"} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors decoration-2 underline-offset-4 hover:underline">Log in</button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-[480px] mx-auto py-8"
              >
                <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto rotate-12 shadow-2xl shadow-indigo-500/10">
                  <CheckCircle className="w-12 h-12 text-indigo-400" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Access Granted!</h2>
                <p className="text-lg text-white/50 mb-12 leading-relaxed font-medium">
                  Identity verified for <strong>{formData.fullname.split(' ')[0]}</strong>. 
                  Synchronizing data with <span className="text-indigo-400 font-bold">{formData.email}</span>...
                </p>
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-2xl shadow-black/40 text-base uppercase tracking-widest"
                >
                  Enter Chatflow
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}