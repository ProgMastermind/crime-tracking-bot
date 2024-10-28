import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  SparklesIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { validateInput } from "../utils/utils";
import { validateCrime } from "../utils/openai";
import toast from "react-hot-toast";

// Geocoding API function
const getLocationDetails = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();
    return data.display_name || `${latitude}, ${longitude}`;
  } catch (error) {
    console.error("Error fetching location details:", error);
    return `${latitude}, ${longitude}`;
  }
};

// Generate unique complaint ID
const generateComplaintId = () => {
  const prefix = "CW";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

const ChatMessage = ({ message, sender, isError }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`flex ${sender === "bot" ? "justify-start" : "justify-end"} mb-4`}
  >
    <div
      className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
        sender === "bot"
          ? "bg-gray-100 text-gray-800"
          : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
      } ${isError ? "bg-red-100 text-red-600" : ""}`}
    >
      {message}
    </div>
  </motion.div>
);

const SubmissionAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-full p-8"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-500" />
      </motion.div>
    </div>
  );
};

const ChatBot = ({ isOpen, onClose, onComplaintSubmitted }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const [expectingFileUpload, setExpectingFileUpload] = useState(false);
  const [expectingLocation, setExpectingLocation] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSubmissionAnimation, setShowSubmissionAnimation] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const steps = [
    {
      question:
        "👋 Welcome to CrimeWatch. I'm here to help you report an incident. First, could you tell me your name?",
      field: "name",
      type: "name",
    },
    {
      question: "Thank you. What is your age?",
      field: "age",
      type: "age",
    },
    {
      question: "Please provide your contact number:",
      field: "mobile",
      type: "mobile",
    },
    {
      question: "What's your current residence?",
      field: "residence",
      type: "lettersOnly",
    },
    {
      question: "Please describe the incident you want to report in detail:",
      field: "crime",
      type: "lettersOnly",
    },
    {
      question: "Do you have any evidence (photos/videos) to support your report?",
      field: "hasProof",
      options: ["Yes", "No"],
    },
    {
      question: "Please upload your evidence:",
      field: "proof",
      type: "file",
    },
    {
      question: "Can you describe any identifying features of those involved?",
      field: "traits",
      type: "lettersOnly",
    },
    {
      question: "How would you like to provide the incident location?",
      field: "locationType",
      options: ["Live Location", "Enter Manually"],
    },
    {
      question: "Please enter the exact location of the incident:",
      field: "location",
      type: "lettersOnly",
    },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: steps[0].question, sender: "bot" }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (message, sender = "user", isError = false) => {
    setMessages(prev => [...prev, { text: message, sender, isError }]);
  };

  const getLiveLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        setIsProcessing(true);
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const locationDetails = await getLocationDetails(latitude, longitude);
        
        addMessage("Using live location", "user");
        addMessage(locationDetails, "user");
        addMessage("Location received successfully!", "bot");

        setTimeout(() => {
          const newUserData = { ...userData, location: locationDetails };
          handleFinalSubmission(newUserData);
          setExpectingLocation(false);
        }, 1000);

      } catch (error) {
        addMessage("Unable to get location. Please enter it manually.", "bot", true);
        setCurrentStep(steps.length - 1);
      } finally {
        setIsProcessing(false);
      }
    } else {
      addMessage("Location services not available. Please enter location manually.", "bot", true);
      setCurrentStep(steps.length - 1);
    }
  };

  const handleSendMessage = async (input = userInput) => {
    if (input.trim() === "" || chatEnded || isProcessing) return;

    const currentStepData = steps[currentStep];
    
    addMessage(input);
    setUserInput("");

    if (currentStepData.type && !validateInput(input, currentStepData.type)) {
      addMessage(`Please provide a valid ${currentStepData.field}.`, "bot", true);
      return;
    }

    const newUserData = { ...userData, [currentStepData.field]: input };
    setUserData(newUserData);

    if (currentStepData.field === "crime") {
      setIsValidating(true);
      const isValidCrime = await validateCrime(input);
      setIsValidating(false);

      if (isValidCrime === "Yes") {
        processNextStep(newUserData, input);
      } else {
        addMessage(
          "Please provide more specific information about the incident.",
          "bot",
          true
        );
      }
      return;
    }

    if (currentStepData.field === "locationType") {
      if (input.toLowerCase() === "live location") {
        setExpectingLocation(true);
        getLiveLocation();
        return;
      }
    }

    if (currentStepData.field === "location") {
      handleFinalSubmission(newUserData);
      return;
    }

    processNextStep(newUserData, input);
  };

  const processNextStep = (newUserData, input) => {
    let nextStep = currentStep + 1;

    if (steps[currentStep].field === "hasProof") {
      if (input.toLowerCase() === "no") {
        nextStep = steps.findIndex((step) => step.field === "traits");
        setExpectingFileUpload(false);
      } else {
        setExpectingFileUpload(true);
        nextStep = steps.findIndex((step) => step.field === "proof");
      }
    }
    else if (steps[currentStep].field === "proof") {
      nextStep = steps.findIndex((step) => step.field === "traits");
      setExpectingFileUpload(false);
    }

    setTimeout(() => {
      addMessage(steps[nextStep].question, "bot");
      setCurrentStep(nextStep);
    }, 300);
  };

  const handleFinalSubmission = (newUserData) => {
    const complaintId = generateComplaintId();
    
    // First, show thank you message
    addMessage(
      "Thank you for your report. Our team will review it and take appropriate action. You'll receive updates via your provided contact information.",
      "bot"
    );
    
    // Store complaint data
    localStorage.setItem(complaintId, JSON.stringify({
      ...newUserData,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    }));
  
    // Show submission animation and handle transition
    setTimeout(() => {
      setShowSubmissionAnimation(true);
      
      // After animation, close chatbot and redirect
      setTimeout(() => {
        onClose(); // Close chatbot
        navigate(`/complaint-status/${complaintId}`);
      }, 2000); // Adjust timing as needed
    }, 3000);
  
    setChatEnded(true);
    toast.success("Report submitted successfully!");
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      addMessage(`Uploaded: ${selectedFile.name}`);
      setUserData({ ...userData, proof: selectedFile });
      setExpectingFileUpload(false);
      setSelectedFile(null);
      processNextStep(userData);
    }
  };

  return (
    <motion.div
      className="w-full md:w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {showSubmissionAnimation && (
        <SubmissionAnimation onComplete={() => setShowSubmissionAnimation(false)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-6 h-6 text-white" />
          <h3 className="text-white font-bold text-lg">CrimeWatch Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-2 rounded-full transition duration-150"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-50"
        style={{ maxHeight: "calc(100% - 140px)" }}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            sender={msg.sender}
            isError={msg.isError}
          />
        ))}
        {(isValidating || isProcessing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-gray-500"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              {isValidating ? (
                <SparklesIcon className="w-5 h-5" />
              ) : (
                <MapPinIcon className="w-5 h-5" />
              )}
            </motion.div>
            <span>{isValidating ? "Analyzing report..." : "Getting location..."}</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!chatEnded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {expectingFileUpload ? (
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-150"
              >
                <PaperClipIcon className="w-5 h-5" />
                <span>{selectedFile ? selectedFile.name : "Choose File"}</span>
              </button>
              {selectedFile && (
                <button
                  onClick={handleFileUpload}
                  className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:opacity-90 transition duration-150"
                >
                  Upload Evidence
                </button>
              )}
            </div>
          ) : steps[currentStep].options ? (
            <div className="flex flex-col space-y-2">
              {steps[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(option)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-150"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={isProcessing || isValidating}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!userInput.trim() || isProcessing || isValidating}
                className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:opacity-90 transition duration-150 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChatBot;
