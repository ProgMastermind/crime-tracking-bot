import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  FlagIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const stages = [
  {
    id: 1,
    title: "Complaint Filed",
    description: "Your complaint has been successfully registered",
    icon: <ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "Initial Review",
    description: "Officers are reviewing your complaint",
    icon: <MagnifyingGlassIcon className="w-6 h-6 text-white" />,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: 3,
    title: "Investigation",
    description: "Active investigation in progress",
    icon: <UserGroupIcon className="w-6 h-6 text-white" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    title: "Evidence Analysis",
    description: "Analyzing collected evidence and information",
    icon: <CheckBadgeIcon className="w-6 h-6 text-white" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 5,
    title: "Final Action",
    description: "Taking appropriate action based on findings",
    icon: <FlagIcon className="w-6 h-6 text-white" />,
    color: "from-orange-500 to-red-500",
  },
];

const StatusCard = ({ stage, index, currentStage }) => {
  const isCompleted = stage.id < currentStage;
  const isActive = stage.id === currentStage;
  const isPending = stage.id > currentStage;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.3 }}
      className="relative"
    >
      {/* Connection Line */}
      {index < stages.length - 1 && (
        <div className="absolute left-[2.25rem] top-[4rem] w-0.5 h-24 bg-gray-800">
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: isCompleted ? "100%" : "0%" }}
            transition={{ duration: 1, delay: index * 0.3 }}
            className={`w-full bg-gradient-to-b ${stage.color}`}
          />
        </div>
      )}

      {/* Status Icon and Content */}
      <div className="flex items-start space-x-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2 }}
          className={`relative flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${
            stage.color
          } ${
            isPending ? "opacity-20" : "opacity-100"
          } flex items-center justify-center`}
        >
          {stage.icon}
          {(isCompleted || isActive) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-white/0"
            />
          )}
        </motion.div>

        <div className="flex-grow pt-2">
          <h3 className={`text-xl font-semibold mb-1 ${
            isPending ? 'text-gray-500' : 'text-white'
          }`}>
            {stage.title}
          </h3>
          <p className={`${
            isPending ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {stage.description}
          </p>
          
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-pink-500 text-sm font-medium">In Progress</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ComplaintStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const complaintData = JSON.parse(localStorage.getItem(id) || '{}');

  useEffect(() => {
    // Animate to second stage after component mount and stop there
    const timer = setTimeout(() => {
      setCurrentStage(2);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#1a1a1a] py-24 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackToHome}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white"
          >
            Complaint ID: {id}
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Complaint Status{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Tracker
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your complaint has been registered successfully and is under initial review.
            We will keep you updated on any progress through your registered contact details.
          </p>
        </div>

        {/* Status Timeline */}
        <div className="max-w-3xl mx-auto space-y-12">
          {stages.map((stage, index) => (
            <StatusCard
              key={stage.id}
              stage={stage}
              index={index}
              currentStage={currentStage}
            />
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400">
            Keep your Complaint ID: <span className="font-medium text-white">{id}</span> for future reference.
            <br />
            You will receive updates via your registered contact information.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComplaintStatus;