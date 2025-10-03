"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const stats = [
  {
    icon: DocumentTextIcon,
    value: 50000,
    suffix: "+",
    label: "Resumes Analyzed",
    gradient: "from-indigo-600 to-cyan-600",
    bgGradient: "from-indigo-50 to-cyan-50"
  },
  {
    icon: ArrowTrendingUpIcon,
    value: 85,
    suffix: "%",
    label: "Success Rate Improvement",
    gradient: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  {
    icon: ClockIcon,
    value: 30,
    suffix: "sec",
    label: "Average Analysis Time",
    gradient: "from-violet-600 to-indigo-600",
    bgGradient: "from-violet-50 to-indigo-50"
  },
  {
    icon: StarIcon,
    value: 4.9,
    suffix: "★",
    label: "User Rating",
    gradient: "from-amber-600 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50"
  }
];

function AnimatedNumber({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count === value ? value : count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Ultra-Modern Dark Background Elements */}
      <div className="absolute inset-0">
        {/* Smart Neural Network Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#374151_0.5px,transparent_0.5px),linear-gradient(to_bottom,#374151_0.5px,transparent_0.5px)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3b82f6_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#8b5cf6_0%,transparent_40%),radial-gradient(circle_at_50%_50%,#06b6d4_0%,transparent_30%)] opacity-10" />
        
        {/* Smart Particle System */}
        <motion.div
          className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.4, 0.8, 1],
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-violet-400/25 to-purple-400/25 rounded-full blur-2xl"
          animate={{
            rotate: [360, 0],
            scale: [0.8, 1.3, 1, 0.9],
            x: [0, -25, 10, 0],
            y: [0, 20, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Smart Data Streams */}
        <motion.div
          className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 2
          }}
        />

        {/* Smart Hexagonal Pattern */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border border-blue-400/20 rounded-lg transform rotate-45" />
          <div className="absolute inset-4 border border-indigo-400/15 rounded-lg transform rotate-45" />
          <div className="absolute inset-8 border border-cyan-400/10 rounded-lg transform rotate-45" />
        </motion.div>

        {/* Smart Energy Fields */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-64 h-64 bg-gradient-to-r from-blue-300/10 via-indigo-300/10 to-purple-300/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute bottom-1/6 right-1/6 w-56 h-56 bg-gradient-to-r from-emerald-300/10 via-teal-300/10 to-cyan-300/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Smart Connection Lines */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent"
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 3
          }}
        />

        {/* Smart Holographic Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully optimized their resumes with our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-white/20 overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-500`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Animated Number */}
                  <div className={`text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>

                  <div className="text-gray-300 font-medium group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/30 shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-200">
              Live stats updated every hour
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
