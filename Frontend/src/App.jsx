import React from 'react'
import { Route, Routes } from 'react-router'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatPage from './pages/ChatPage.jsx'


function App() {
  return (

     <div className="min-h-screen bg-slate-900 relative overflow-hidden flex items-center justify-center">
      
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        {/* purple glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-20 blur-[120px]" />
        
        {/* cyan glow */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 opacity-20 blur-[120px]" />
        
        {/* grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Routes stay EXACTLY same */}
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
    </div>
  )
}

export default App
