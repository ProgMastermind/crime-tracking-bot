import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import ComplaintStatus from "./components/ComplaintStatus";

// Page Transition Component
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// Main Content Component
const MainContent = ({ isChatOpen, handleChatToggle, isPageLoaded, scrollProgress }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative bg-[#1a1a1a] min-h-screen"
  >
    {/* Progress Bar */}
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600 z-50"
      style={{ 
        scaleX: scrollProgress / 100,
        transformOrigin: "left"
      }}
      initial={{ scaleX: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    />

    {/* Main Content */}
    <main className="relative z-10">
      <Hero 
        onOpenChat={() => handleChatToggle(true)} 
        isPageLoaded={isPageLoaded}
      />
      <Features />
      <HowItWorks />
      <Footer />
    </main>

    {/* Floating Chat Button */}
    <AnimatePresence>
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChatToggle(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative">
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  </motion.div>
);

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChatToggle = (state) => {
    setIsChatOpen(state);
    document.body.style.overflow = state ? 'hidden' : '';
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/" 
            element={
              <PageTransition>
                <MainContent 
                  isChatOpen={isChatOpen}
                  handleChatToggle={handleChatToggle}
                  isPageLoaded={isPageLoaded}
                  scrollProgress={scrollProgress}
                />
              </PageTransition>
            } 
          />
          <Route 
            path="/complaint-status/:id" 
            element={
              <PageTransition>
                <ComplaintStatus />
              </PageTransition>
            } 
          />
        </Routes>

        {/* ChatBot */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center md:items-end md:justify-end md:inset-auto md:right-6 md:bottom-6"
            >
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => handleChatToggle(false)}
              />
              <ChatBot 
                isOpen={isChatOpen} 
                onClose={() => handleChatToggle(false)}
                key={isChatOpen ? 'open' : 'closed'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#2a2a2a",
            color: "#fff",
            borderRadius: "0.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            duration: 3000,
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            duration: 4000,
          },
        }}
      />
    </Router>
  );
};

export default App;
