
// import React, { useState } from 'react';
// // import ChatBot from './components/ChatBot';
// import ChatBot from './components/chatbot';

// const App = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   return (
//     <div className="App">
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Crime Reporting Application</h1>
//         </div>
//       </header>
//       <main>
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           <div className="px-4 py-6 sm:px-0">
//             <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
//               <button
//                 onClick={() => setIsChatOpen(true)}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Report a Crime
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
      
      
//         <button
//           onClick={() => setIsChatOpen(true)}
//           className="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
//         >
//           <Send size={24} />
//         </button>
      
      
//       <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
//     </div>
//     </div>
//   );
// };

// export default App;

// App.js

import React, { useState } from 'react';
import ChatBot from './components/chatbot';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="App">
      <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Crime Reporting Application</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Report a Crime
              </button>
            </div>
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
  );
};

export default App;
