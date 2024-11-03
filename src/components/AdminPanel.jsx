import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useSpring, animated } from '@react-spring/web';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
    'in-review': 'bg-blue-500/20 text-blue-500 border-blue-500/20',
    'under-investigation': 'bg-purple-500/20 text-purple-500 border-purple-500/20',
    completed: 'bg-green-500/20 text-green-500 border-green-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
};

const ProgressBar = ({ progress }) => {
  const props = useSpring({
    width: `${progress}%`,
    from: { width: '0%' },
  });

  return (
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <animated.div
        style={props}
        className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, color, increase }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-[#2a2a2a] p-6 rounded-2xl border border-gray-800 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8" />
    
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <div className="flex items-center space-x-2">
          <h4 className="text-2xl font-bold text-white">{value}</h4>
          {increase && (
            <span className="text-xs font-medium text-green-500">+{increase}%</span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const StatusButton = ({ status, isActive, onClick, children }) => {
  const statusColors = {
    pending: 'from-yellow-500 to-orange-600',
    'in-review': 'from-blue-500 to-cyan-600',
    'under-investigation': 'from-purple-500 to-indigo-600',
    completed: 'from-green-500 to-emerald-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2
        ${isActive 
          ? `bg-gradient-to-r ${statusColors[status]} text-white shadow-lg` 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
    >
      {children}
    </motion.button>
  );
};

const CrimeCard = ({ crime, onUpdateStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(crime.status || 'pending');

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/reports/${crime._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setCurrentStatus(newStatus);
      onUpdateStatus(crime._id, newStatus);
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#2a2a2a] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors duration-300"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{crime.name}</h3>
                <p className="text-sm text-gray-400">{crime.uniqueId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <StatusBadge status={currentStatus} />
              <span className="text-sm text-gray-500">
                {new Date(crime.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
          <motion.button
            initial={false}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-800/50 p-4 rounded-xl">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <PhoneIcon className="w-4 h-4" />
                    <span className="text-sm">Contact</span>
                  </div>
                  <p className="text-white">{crime.mobile}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="text-white">{crime.location}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">Residence</span>
                  </div>
                  <p className="text-white">{crime.residence}</p>
                </div>
              </div>

              {/* Crime Description */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <h4 className="text-gray-400 text-sm mb-2">Crime Description</h4>
                <p className="text-white">{crime.crime}</p>
              </div>

              {/* Evidence Section */}
              {crime.proof && (
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <h4 className="text-gray-400 text-sm mb-2">Evidence</h4>
                  <img 
                    src={`http://localhost:5000/uploads/${crime.proof}`} 
                    alt="Evidence" 
                    className="rounded-lg max-h-48 object-cover"
                  />
                </div>
              )}

              {/* Status Update Section */}
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-gray-400 text-sm mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  <StatusButton
                    status="pending"
                    isActive={currentStatus === 'pending'}
                    onClick={() => handleStatusUpdate('pending')}
                  >
                    <ClockIcon className="w-4 h-4" />
                    <span>Pending</span>
                  </StatusButton>

                  <StatusButton
                    status="in-review"
                    isActive={currentStatus === 'in-review'}
                    onClick={() => handleStatusUpdate('in-review')}
                  >
                    <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                    <span>In Review</span>
                  </StatusButton>

                  <StatusButton
                    status="under-investigation"
                    isActive={currentStatus === 'under-investigation'}
                    onClick={() => handleStatusUpdate('under-investigation')}
                  >
                    <UsersIcon className="w-4 h-4" />
                    <span>Under Investigation</span>
                  </StatusButton>

                  <StatusButton
                    status="completed"
                    isActive={currentStatus === 'completed'}
                    onClick={() => handleStatusUpdate('completed')}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Completed</span>
                  </StatusButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const AdminPanel = () => {
    const [crimes, setCrimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      inReview: 0,
      underInvestigation: 0,
      completed: 0,
    });
    const [refreshKey, setRefreshKey] = useState(0);
  
    useEffect(() => {
      fetchCrimes();
    }, [refreshKey]);
  
    const fetchCrimes = async () => {
      try {
        setLoading(true);
        console.log('Fetching crimes...');
        
        const response = await fetch('http://localhost:5000/reports');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        setCrimes(data);
        
        // Calculate stats
        setStats({
          total: data.length,
          pending: data.filter(c => c.status === 'pending' || !c.status).length,
          inReview: data.filter(c => c.status === 'in-review').length,
          underInvestigation: data.filter(c => c.status === 'under-investigation').length,
          completed: data.filter(c => c.status === 'completed').length,
        });
      } catch (error) {
        console.error('Error fetching crimes:', error);
        toast.error('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
  
    const handleUpdateStatus = async (id, newStatus) => {
      const updatedCrimes = crimes.map(crime => 
        crime._id === id ? { ...crime, status: newStatus } : crime
      );
      setCrimes(updatedCrimes);
      
      // Update stats
      setStats({
        total: updatedCrimes.length,
        pending: updatedCrimes.filter(c => c.status === 'pending' || !c.status).length,
        inReview: updatedCrimes.filter(c => c.status === 'in-review').length,
        underInvestigation: updatedCrimes.filter(c => c.status === 'under-investigation').length,
        completed: updatedCrimes.filter(c => c.status === 'completed').length,
      });
    };
  
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
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
  
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage and monitor crime reports</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRefreshKey(old => old + 1)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Refresh</span>
            </motion.button>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Reports"
              value={stats.total}
              icon={<DocumentMagnifyingGlassIcon className="w-6 h-6 text-white" />}
              color="from-pink-500 to-rose-500"
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon={<ClockIcon className="w-6 h-6 text-white" />}
              color="from-yellow-500 to-orange-500"
              increase={stats.pending > 0 ? ((stats.pending / stats.total) * 100).toFixed(0) : 0}
            />
            <StatCard
              title="In Review"
              value={stats.inReview}
              icon={<DocumentMagnifyingGlassIcon className="w-6 h-6 text-white" />}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              title="Under Investigation"
              value={stats.underInvestigation}
              icon={<UsersIcon className="w-6 h-6 text-white" />}
              color="from-purple-500 to-indigo-500"
            />
            <StatCard
              title="Completed Cases"
              value={stats.completed}
              icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
              color="from-green-500 to-emerald-500"
            />
          </div>
  
          {/* Crime Reports */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Reports</h2>
            </div>
  
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {crimes.map((crime) => (
                    <CrimeCard
                      key={crime._id}
                      crime={crime}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminPanel;