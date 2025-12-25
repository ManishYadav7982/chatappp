import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";

import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import PageLoader from "./components/PageLoader.jsx";

import { useAuthStore } from "./store/useAuthStore.js";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ⏳ Optional loading state
  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex items-center justify-center">
      
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 opacity-20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <Routes>
        {/* Protected route */}
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />

        {/* Auth routes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* <Route path="/signup" element={<SignUpPage />} /> */}

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            maxWidth: "90vw",
            margin: "0 auto",
          },
        }}
      />
    </div>
  );
}

export default App;
