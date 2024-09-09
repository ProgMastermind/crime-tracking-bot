// ChatMessage.js

import React from 'react';

const ChatMessage = ({ message, sender }) => (
  <div className={`mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
    <span className={`inline-block p-3 rounded-lg ${sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} shadow`}>
      {message}
    </span>
  </div>
);

export default ChatMessage;
