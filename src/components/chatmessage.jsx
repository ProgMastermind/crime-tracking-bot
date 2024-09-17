import React from "react";

const ChatMessage = ({ message, sender, isError }) => {
  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          sender === "user"
            ? "bg-blue-500 text-white"
            : isError
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-gray-200 text-gray-800"
        } shadow`}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};
export default ChatMessage;
