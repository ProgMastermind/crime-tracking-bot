import React, { useState } from "react";
import ChatBot from "./components/chatbot";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="App">
      <div className="bg-gray-100 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Crime Reporting Application
            </h1>
          </div>
        </header>
        <main>
          <div className="bg-gray-100 relative mx-auto py-6 sm:px-6 lg:px-8">
            <div className="max-lg:w-full w-3/5 px-4 py-6 border-4 border-dashed border-gray-500 rounded-lg h-96 flex items-center justify-center max-sm:justify-start">
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Report a Crime
              </button>
            </div>
          </div>
        </main>

        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
        >
          Open Chatbot
        </button>
        {isChatOpen && (
          <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
      </div>
    </div>

    //   <div className="min-h-screen w-full bg-gray-100 p-6">
    //   {/* Container div to align content at the top */}
    //   <div className="mx-auto max-w-4xl">
    //     <h1 className="text-xl font-bold mb-4">My App</h1>
    //     <p>This is my content</p>
    //   </div>
    // </div>
  );
};

export default App;
