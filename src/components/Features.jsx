import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  CloudArrowUpIcon,
  BoltIcon,
  UserGroupIcon,
  ClockIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  const features = [
    {
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      title: "Secure Storage",
      description: "End-to-end encrypted platform ensuring your data safety and privacy",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Track the status of your report with instant notifications",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms to process and validate reports efficiently",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: "Quick Response",
      description: "Fast and efficient handling of reported incidents",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for emergency situations",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: <LockClosedIcon className="w-8 h-8" />,
      title: "Verified Reports",
      description: "Multi-level verification system for accurate reporting",
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-[#1f1f1f] relative overflow-hidden" id="about">
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
              <ShieldCheckIcon className="w-8 h-8 text-pink-500" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl font-bold text-white mb-4 font-display">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              CrimeWatch
            </span>
            ?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Our platform combines cutting-edge technology with user-friendly design
            to make crime reporting accessible and effective.
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-[#2a2a2a] p-8 rounded-2xl h-full hover:bg-[#2f2f2f] transition-all duration-300 border border-gray-800">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-4 font-display tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
      </div>
    </section>
  );
};

export default About;