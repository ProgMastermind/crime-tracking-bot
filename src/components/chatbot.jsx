// ChatBot.js

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MapPin, Camera, AlertTriangle } from 'lucide-react';
import { validateInput } from '../utils/utils';
import ChatMessage from './chatmessage';

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const steps = [
    { question: "Welcome to the Crime Reporting System. Please state your name:", field: "name", type: "name" },
    { question: "Thank you. What is your age?", field: "age", type: "age" },
    { question: "Please provide your mobile number:", field: "mobile", type: "mobile" },
    { question: "What is your place of residence?", field: "residence", type: "lettersOnly" },
    { question: "Please describe the crime you want to report:", field: "crime", type: "lettersOnly" },
    { question: "Do you have any proof like a photo or video?", field: "hasProof", options: ["Yes", "No"] },
    { question: "Can you mention any traits of the suspect?", field: "traits", type: "lettersOnly" },
    { question: "How would you like to provide the location?", field: "locationType", options: ["Live Location", "Enter Manually"] },
    { question: "Please enter the location:", field: "location", type: "lettersOnly" },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: steps[0].question, sender: 'bot' }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;

    const currentStepData = steps[currentStep];
    if (currentStepData.type && !validateInput(userInput, currentStepData.type)) {
      setError(`Invalid input. Please provide a valid ${currentStepData.field} using only letters and basic punctuation.`);
      return;
    }

    setError('');
    const newUserData = { ...userData, [currentStepData.field]: userInput };
    setUserData(newUserData);

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);

    if (currentStep === steps.length - 1) {
      handleFinalSubmission(newMessages, newUserData);
    } else {
      processNextStep(newMessages, newUserData);
    }

    setUserInput('');
  };

  const handleFinalSubmission = (newMessages, newUserData) => {
    console.log("Final user data:", newUserData);
    setTimeout(() => {
      setMessages([...newMessages, { text: "Thank you for reporting. We will provide you with updates on the progress.", sender: 'bot' }]);
    }, 500);
  };

  const processNextStep = (newMessages, newUserData) => {
    let nextStep = currentStep + 1;

    if (steps[currentStep].field === 'hasProof') {
      if (userInput.toLowerCase() === 'no') {
        nextStep = steps.findIndex(step => step.field === 'traits');
      } else {
        newMessages.push({ text: "Please upload your photo or video evidence.", sender: 'bot' });
        setMessages(newMessages);
        return;
      }
    } else if (steps[currentStep].field === 'locationType') {
      if (userInput.toLowerCase() === 'live location') {
        getLiveLocation(newMessages, newUserData);
        return;
      }
    }

    setTimeout(() => {
      setMessages([...newMessages, { text: steps[nextStep].question, sender: 'bot' }]);
      setCurrentStep(nextStep);
    }, 500);
  };

  const getLiveLocation = (newMessages, newUserData) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const location = data.display_name;
            newMessages.push({ text: `Location detected: ${location}`, sender: 'bot' });
            setMessages(newMessages);
            setUserData({ ...newUserData, location: location });
            handleFinalSubmission(newMessages, { ...newUserData, location: location });
          } catch (error) {
            console.error("Error fetching location data:", error);
            newMessages.push({ text: "Unable to fetch location. Please enter manually.", sender: 'bot' });
            setMessages([...newMessages, { text: steps[steps.length - 1].question, sender: 'bot' }]);
            setCurrentStep(steps.length - 1);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          newMessages.push({ text: "Unable to get live location. Please enter manually.", sender: 'bot' });
          setMessages([...newMessages, { text: steps[steps.length - 1].question, sender: 'bot' }]);
          setCurrentStep(steps.length - 1);
        }
      );
    } else {
      newMessages.push({ text: "Geolocation is not supported by your browser. Please enter location manually.", sender: 'bot' });
      setMessages([...newMessages, { text: steps[steps.length - 1].question, sender: 'bot' }]);
      setCurrentStep(steps.length - 1);
    }
  };

  const resetChat = () => {
    setMessages([{ text: steps[0].question, sender: 'bot' }]);
    setCurrentStep(0);
    setUserInput('');
    setUserData({});
    setError('');
  };

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl transition-all duration-300 ${isOpen ? 'h-[32rem]' : 'h-0'} overflow-hidden flex flex-col`}>
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h3 className="font-bold text-lg">Crime Report Chatbot</h3>
        <button onClick={() => { onClose(); resetChat(); }} className="text-white hover:text-gray-200">
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100" style={{ maxHeight: 'calc(32rem - 120px)' }}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} sender={msg.sender} />
        ))}
        {steps[currentStep].options && (
          <div className="flex justify-center space-x-2 my-2">
            {steps[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setUserInput(option);
                  handleSendMessage();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={error || 'Type your message here...'}
          className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
