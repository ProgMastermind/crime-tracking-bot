import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ShieldCheckIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const SelectView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaintId = location.state?.complaintId;

  const handleViewSelect = (view) => {
    if (view === 'admin') {
      window.open('/admin-panel', '_blank');
    } else {
      navigate(`/complaint-status/${complaintId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
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

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center"
          >
            <DocumentTextIcon className="w-10 h-10 text-pink-500" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              View
            </span>
          </h2>
          {complaintId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white text-sm">
                Complaint ID: {complaintId}
              </span>
            </motion.div>
          )}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select how you'd like to proceed with the platform
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User View Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleViewSelect('user')}
            className="group cursor-pointer relative h-[320px]" // Fixed height
          >
            <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-gray-800 hover:bg-[#2f2f2f] transition-all duration-300 h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <UserCircleIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">User Dashboard</h3>
                <p className="text-gray-400 text-center mb-6">
                  Track your complaint status and receive live updates on your case
                </p>
              </div>

              <div className="flex justify-center mt-auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full text-white text-sm flex items-center space-x-2 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300"
                >
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                  <span>Track Status</span>
                  <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Admin View Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleViewSelect('admin')}
            className="group cursor-pointer relative h-[320px]" // Fixed height
          >
            <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-gray-800 hover:bg-[#2f2f2f] transition-all duration-300 h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheckIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Admin Dashboard</h3>
                <p className="text-gray-400 text-center mb-6">
                  Access administrative controls to manage and review all complaints
                </p>
              </div>

              <div className="flex justify-center mt-auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 rounded-full text-white text-sm flex items-center space-x-2 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-indigo-600 transition-all duration-300"
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>Access Dashboard</span>
                  <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelectView;