import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
  const {logout} = useAuthStore();

  return (
    <div>
      <h1>Welcome to Chat Page</h1>
      <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  )
}

export default ChatPage
