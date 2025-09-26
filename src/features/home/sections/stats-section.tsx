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
    gradient: "from-blue-600 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50"
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
    gradient: "from-purple-600 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    icon: StarIcon,
    value: 4.9,
    suffix: "★",
    label: "User Rating",
    gradient: "from-orange-600 to-red-600",
    bgGradient: "from-orange-50 to-red-50"
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
    <section className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl rounded-full" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-2xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 border border-white/50 overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Animated Number */}
                  <div className={`text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>

                  <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
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
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Live stats updated every hour
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
