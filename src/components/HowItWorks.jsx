import React from "react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ClockIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Features = () => {
  const steps = [
    {
      number: "01",
      title: "Start Report",
      description: "Open our AI chatbot and begin the reporting process securely",
      icon: <DocumentTextIcon className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      delay: 0.2,
    },
    {
      number: "02",
      title: "Provide Details",
      description: "Share incident information with guided AI assistance",
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
      delay: 0.4,
    },
    {
      number: "03",
      title: "Real-time Updates",
      description: "Track your report status with live progress notifications",
      icon: <ClockIcon className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      delay: 0.6,
    },
    {
      number: "04",
      title: "Secure Storage",
      description: "All data is encrypted and stored with maximum security",
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
      delay: 0.8,
    },
  ];

  return (
    <section className="py-24 bg-[#1a1a1a] relative overflow-hidden" id="features">
      {/* Enhanced Background Gradients */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 p-3 rounded-xl mb-4 backdrop-blur-xl">
              <DocumentTextIcon className="w-8 h-8 text-pink-500" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4 font-display">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Works
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Our streamlined process ensures efficient and secure crime reporting
          </p>
        </motion.div>

        {/* Main Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.delay }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="bg-[#2a2a2a] p-8 rounded-2xl h-full border border-gray-800 hover:bg-[#2f2f2f] transition-all duration-300">
                {/* Step Number and Icon */}
                <div className="flex justify-between items-center mb-6">
                  <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                    {step.number}
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`p-3 bg-gradient-to-r ${step.color} rounded-xl opacity-75`}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-4 font-display tracking-wide">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Connection Line */}
                {index !== steps.length - 1 && (
                  <div className="hidden lg:flex items-center absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 opacity-50">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <ArrowRightIcon className="w-6 h-6 text-gray-600" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Enhanced Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;