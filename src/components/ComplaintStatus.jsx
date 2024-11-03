import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  FlagIcon,
  ArrowLeftIcon,
  PhoneIcon,
  CalendarIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

const stages = [
  {
    id: 'pending',
    title: "Complaint Filed",
    description: "Your complaint has been successfully registered",
    icon: <ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 'in-review',
    title: "Initial Review",
    description: "Officers are reviewing your complaint",
    icon: <MagnifyingGlassIcon className="w-6 h-6 text-white" />,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: 'under-investigation',
    title: "Investigation",
    description: "Active investigation in progress",
    icon: <UserGroupIcon className="w-6 h-6 text-white" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 'completed',
    title: "Final Action",
    description: "Investigation completed and action taken",
    icon: <FlagIcon className="w-6 h-6 text-white" />,
    color: "from-green-500 to-emerald-500",
  },
];

const ComplaintStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`http://localhost:5000/report/${id}`);
      
      if (!response.ok) {
        throw new Error('Report not found');
      }
      
      const data = await response.json();
      setReportData(data);
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error('Error fetching report:', err);
      setError("Failed to fetch report status");
      toast.error("Failed to fetch status");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [id]);

  const getCurrentStageIndex = () => {
    if (!reportData?.status) return 0;
    return stages.findIndex(stage => stage.id === reportData.status);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 text-red-500"
          >
            <ExclamationCircleIcon className="w-full h-full" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToHome}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

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

        {/* Header with Refresh Button */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white"
            >
              Complaint ID: {id}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStatus}
              disabled={refreshing}
              className={`p-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 
                hover:from-pink-500/30 hover:to-purple-600/30 transition-all duration-300
                ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowPathIcon className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Complaint Status{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Tracker
            </span>
          </h2>

          {/* Complaint Details Card */}
          {reportData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-[#2a2a2a] rounded-xl p-6 mb-8 border border-gray-800"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-pink-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{reportData.name}</h3>
                  <p className="text-gray-400 text-sm">{reportData.residence}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{reportData.mobile}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(reportData.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="max-w-3xl mx-auto space-y-12">
          {stages.map((stage, index) => {
            const isCompleted = index <= getCurrentStageIndex();
            const isActive = index === getCurrentStageIndex();
            const isPending = index > getCurrentStageIndex();
            const isFinalStage = index === stages.length - 1;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-[2.25rem] top-[4rem] w-0.5 h-24 bg-gray-800">
                    <motion.div
                      initial={{ height: "0%" }}
                      animate={{ height: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                      className={`w-full bg-gradient-to-b ${
                        isCompleted ? stage.color : 'from-gray-800 to-gray-800'
                      }`}
                    />
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${
                      isCompleted || isActive ? stage.color : 'from-gray-700 to-gray-600'
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
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
                          isFinalStage && isActive
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20'
                            : 'bg-gradient-to-r from-pink-500/20 to-purple-600/20'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            isFinalStage && isActive ? 'bg-green-500' : 'bg-pink-500'
                          } animate-pulse`} />
                          <span className={`text-sm font-medium ${
                            isFinalStage && isActive ? 'text-green-500' : 'text-pink-500'
                          }`}>
                            {isFinalStage && isActive ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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