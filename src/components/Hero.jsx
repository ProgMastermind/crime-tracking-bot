import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useSpring, animated } from "@react-spring/web";

// ModernChatbotLogo Component
const ModernChatbotLogo = () => (
  <motion.div 
    className="flex items-center space-x-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="relative w-12 h-12">
      <motion.div
        className="absolute inset-0 rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600"
        whileHover={{ scale: 1.05 }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="8" width="32" height="32" rx="8" fill="white" fillOpacity="0.1" />
          <motion.g
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <circle cx="19" cy="22" r="3" fill="white" />
            <circle cx="29" cy="22" r="3" fill="white" />
          </motion.g>
          <motion.path
            d="M16 32h16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </svg>
      </motion.div>
    </div>
    <motion.span 
      className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text font-display tracking-tight"
      whileHover={{ scale: 1.02 }}
    >
      CrimeWatch
    </motion.span>
  </motion.div>
);

// Message Bubble Component
const MessageBubble = ({ type, message, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`flex ${type === "user" ? "justify-end" : "justify-start"} mb-4`}
  >
    <div
      className={`max-w-[80%] p-4 rounded-2xl ${
        type === "user"
          ? "bg-gradient-to-r from-pink-500 to-purple-600"
          : "bg-white/10"
      }`}
    >
      <p className="text-white">{message}</p>
    </div>
  </motion.div>
);

// Typing Indicator Component
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.1 }}
    className="flex space-x-2 mt-4"
  >
    {[0, 0.2, 0.4].map((delay, index) => (
      <div
        key={index}
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: `${delay}s` }}
      />
    ))}
  </motion.div>
);

// Interactive Chat Interface Component
const ChatInterface = () => {
  const springs = useSpring({
    from: { y: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: 10 });
        await next({ y: 0 });
      }
    },
    config: { duration: 2000 },
  });

  return (
    <animated.div
      style={springs}
      className="relative w-full h-[600px] bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-2xl border border-white/10 backdrop-blur-xl"
    >
      {/* Interface Header */}
      <div className="absolute top-0 left-0 right-0 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white/80 font-medium">AI Assistant Active</span>
          </div>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white/20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="absolute top-20 left-0 right-0 bottom-20 overflow-hidden p-6">
        <MessageBubble
          delay={0.2}
          type="assistant"
          message="Hello! I'm here to help you report any suspicious activities or crimes."
        />
        <MessageBubble
          delay={0.5}
          type="user"
          message="I'd like to report an incident."
        />
        <MessageBubble
          delay={0.8}
          type="assistant"
          message="I'll guide you through the process. Your safety and privacy are our top priorities."
        />
        <TypingIndicator />
      </div>

      {/* Input Area with Rotated Message Icon */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"
          >
            <svg
              className="w-6 h-6 text-white transform rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </animated.div>
  );
};

// Main Hero Component
const Hero = ({ onOpenChat }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navItems = ["Home", "About", "Features", "Contact"];

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      opacity: {
        value: 0.1,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.1,
        width: 1,
      },
    },
    detectRetina: true,
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="absolute inset-0"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Navigation */}
        <nav className="py-6">
          <div className="flex items-center justify-between">
            <ModernChatbotLogo />

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenChat}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium"
              >
                Report Crime
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden mt-4"
              >
                <div className="bg-[#232323] rounded-xl p-4 space-y-4 border border-gray-800">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <button
                    onClick={() => {
                      onOpenChat();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Report Crime
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)] py-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Report Crime.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Make a Difference.
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                Our AI-powered platform makes crime reporting simple, secure, and
                effective. Take action today and help create a safer community for
                everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenChat}
                  className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                >
                  <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Report Now</span>
                </motion.button>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 text-center border border-white/10"
                >
                  Learn More
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <ChatInterface />
          </motion.div>
        </div>

        {/* Scroll Indicator - Significantly Lowered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-48 left-1/2 transform -translate-x-1/2" // Much lower position
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="text-gray-400 flex flex-col items-center"
          >
            <span className="text-sm mb-2 font-medium">Scroll to explore</span>
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;