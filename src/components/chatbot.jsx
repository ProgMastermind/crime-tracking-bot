import React, { useState, useEffect, useRef } from "react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import { validateInput } from "../utils/utils";
import { validateCrime } from "../utils/openai";
import ChatMessage from "./chatmessage";

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const [expectingFileUpload, setExpectingFileUpload] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const steps = [
    {
      question:
        "Welcome to the Crime Reporting System. Please state your name:",
      field: "name",
      type: "name",
    },
    { question: "Thank you. What is your age?", field: "age", type: "age" },
    {
      question: "Please provide your mobile number:",
      field: "mobile",
      type: "mobile",
    },
    {
      question: "What is your place of residence?",
      field: "residence",
      type: "lettersOnly",
    },
    {
      question: "Please describe the crime you want to report:",
      field: "crime",
      type: "lettersOnly",
    },
    {
      question: "Do you have any proof like a photo or video?",
      field: "hasProof",
      options: ["Yes", "No"],
    },
    {
      question: "Please upload your photo or video evidence.",
      field: "proof",
      type: "file",
    },
    {
      question: "Can you mention any traits of the suspect?",
      field: "traits",
      type: "lettersOnly",
    },
    {
      question: "How would you like to provide the location?",
      field: "locationType",
      options: ["Live Location", "Enter Manually"],
    },
    {
      question: "Please enter the location:",
      field: "location",
      type: "lettersOnly",
    },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: steps[0].question, sender: "bot" }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (input = userInput) => {
    if (input.trim() === "" || chatEnded) return;

    const currentStepData = steps[currentStep];
    if (currentStepData.type && !validateInput(input, currentStepData.type)) {
      const errorMessage = `The entered ${currentStepData.field} is not valid. Please enter a valid ${currentStepData.field}.`;
      setMessages([
        ...messages,
        { text: input, sender: "user" },
        { text: errorMessage, sender: "bot", isError: true },
      ]);
      setError("");
      return;
    }

    setError("");
    const newUserData = { ...userData, [currentStepData.field]: input };
    setUserData(newUserData);

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);

    if (currentStepData.field === "crime") {
      setIsValidating(true);
      const isValidCrime = await validateCrime(input);
      setIsValidating(false);

      if (isValidCrime === "Yes") {
        processNextStep(newMessages, newUserData, input);
      } else {
        setMessages([
          ...newMessages,
          {
            text: "The reported incident doesn't seem to be a valid crime. Please provide more details or report a different incident.",
            sender: "bot",
            isError: true,
          },
        ]);
        return;
      }
    } else if (
      currentStep === steps.length - 1 ||
      currentStepData.field === "location"
    ) {
      handleFinalSubmission(newMessages, newUserData);
    } else {
      processNextStep(newMessages, newUserData, input);
    }

    setUserInput("");
  };

  const handleFinalSubmission = (newMessages, newUserData) => {
    console.log("Final user data:", newUserData);
    setTimeout(() => {
      const finalMessage = {
        text: "Thank you for reporting. We will provide you with updates on the progress.",
        sender: "bot",
      };
      setMessages([...newMessages, finalMessage]);
      setChatEnded(true);
    }, 500);
  };

  const processNextStep = (newMessages, newUserData, input) => {
    let nextStep = currentStep + 1;

    if (steps[currentStep].field === "hasProof") {
      if (input.toLowerCase() === "no") {
        nextStep = steps.findIndex((step) => step.field === "traits");
      } else {
        setExpectingFileUpload(true);
        nextStep = steps.findIndex((step) => step.field === "proof");
      }
    } else if (steps[currentStep].field === "proof") {
      nextStep = steps.findIndex((step) => step.field === "locationType");
    } else if (steps[currentStep].field === "locationType") {
      if (input.toLowerCase() === "live location") {
        getLiveLocation(newMessages, newUserData);
        return;
      }
    }

    setTimeout(() => {
      setMessages([
        ...newMessages,
        { text: steps[nextStep].question, sender: "bot" },
      ]);
      setCurrentStep(nextStep);
    }, 50);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      setMessages([
        ...messages,
        { text: `Uploaded file: ${selectedFile.name}`, sender: "user" },
      ]);
      setUserData({ ...userData, proof: selectedFile.name });
      setExpectingFileUpload(false);
      setSelectedFile(null);
      processNextStep(
        [
          ...messages,
          { text: `Uploaded file: ${selectedFile.name}`, sender: "user" },
        ],
        userData,
      );
    }
  };

  const getLiveLocation = async (newMessages, newUserData) => {
    const getBrowserLocation = () => {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              }),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
          );
        } else {
          reject(new Error("Geolocation not available"));
        }
      });
    };

    const getNominatimLocation = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        );
        const data = await response.json();
        if (data.display_name) {
          return data.display_name;
        }
        throw new Error("Nominatim geocoding failed");
      } catch (error) {
        console.error("Error fetching Nominatim location:", error);
        return null;
      }
    };

    try {
      newMessages.push({ text: "Fetching your location...", sender: "bot" });
      setMessages([...newMessages]);

      const coords = await getBrowserLocation();
      const location = await getNominatimLocation(coords.lat, coords.lon);

      if (location) {
        newMessages.push({
          text: `Location detected: ${location}`,
          sender: "bot",
        });
        setMessages(newMessages);
        handleFinalSubmission(newMessages, {
          ...newUserData,
          location: location,
        });
      } else {
        throw new Error("Unable to get detailed location");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      newMessages.push({
        text: "Unable to get location automatically. Please enter manually.",
        sender: "bot",
      });
      setMessages([
        ...newMessages,
        { text: steps[steps.length - 1].question, sender: "bot" },
      ]);
      setCurrentStep(steps.length - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !chatEnded) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{ text: steps[0].question, sender: "bot" }]);
    setCurrentStep(0);
    setUserInput("");
    setUserData({});
    setError("");
    setExpectingFileUpload(false);
    setChatEnded(false);
    setSelectedFile(null);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
        isOpen ? "h-[32rem] opacity-100" : "h-0 opacity-0"
      } overflow-hidden flex flex-col`}
    >
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h3 className="font-bold text-lg">Crime Report Assistant</h3>
        <button
          onClick={() => {
            onClose();
            resetChat();
          }}
          className="text-white hover:text-gray-200 transition duration-150"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-50"
        style={{ maxHeight: "calc(32rem - 120px)" }}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            sender={msg.sender}
            isError={msg.isError}
          />
        ))}
        {!chatEnded && steps[currentStep].options && (
          <div className="flex justify-center space-x-2 my-2">
            {steps[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(option)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition duration-150"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {!chatEnded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {isValidating ? (
            <div className="text-center">Validating crime report...</div>
          ) : expectingFileUpload ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex-grow px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition duration-150 text-sm"
                >
                  {selectedFile ? selectedFile.name : "Choose File"}
                </button>
              </div>
              <button
                onClick={handleFileUpload}
                className={`w-full px-4 py-2 ${
                  selectedFile
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white rounded-full shadow transition duration-150 text-sm`}
                disabled={!selectedFile}
              >
                <div className="flex items-center justify-center">
                  <PaperClipIcon className="h-5 w-5 mr-2" />
                  Upload
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message here..."
                onKeyDown={handleKeyDown}
                className="flex-grow border border-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="ml-2 p-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition duration-150"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
