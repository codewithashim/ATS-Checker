"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  DocumentArrowUpIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: DocumentArrowUpIcon,
    title: "Upload Documents",
    description: "Upload your resume (PDF/DOCX) and paste the job description you're targeting. Our secure upload system processes your documents instantly.",
    gradient: "from-indigo-600 to-cyan-600",
    bgGradient: "from-indigo-600/10 to-cyan-600/10",
    delay: 0.2
  },
  {
    icon: CpuChipIcon,
    title: "AI Analysis",
    description: "Our advanced AI engine analyzes your resume against job requirements using cutting-edge natural language processing and machine learning algorithms.",
    gradient: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-600/10 to-teal-600/10",
    delay: 0.4
  },
  {
    icon: PresentationChartLineIcon,
    title: "Get Insights",
    description: "Receive comprehensive scoring, keyword analysis, and actionable recommendations to optimize your resume for maximum ATS compatibility.",
    gradient: "from-violet-600 to-indigo-600",
    bgGradient: "from-violet-600/10 to-indigo-600/10",
    delay: 0.6
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
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
          className="text-center mb-20"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-300 border-indigo-400/20 backdrop-blur-sm">
            🚀 How It Works
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Simple
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}3-Step{" "}
            </span>
            Process
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get professional resume insights in minutes with our streamlined, 
            AI-powered analysis process designed for maximum efficiency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: step.delay }}
              className="relative group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: step.delay + 0.3 }}
                  className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500/50 to-cyan-500/50 transform -translate-x-4 z-10"
                  style={{ transformOrigin: "left" }}
                />
              )}

              <div className="relative">
                {/* Step Card */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center group-hover:bg-white/10 transition-all duration-500"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Step {index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <step.icon className="w-12 h-12 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {step.description}
                  </p>

                  {/* Decorative gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of job seekers who have already optimized their resumes with our AI-powered platform.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="group text-lg px-10 py-4 h-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg border-0"
              >
                Start Free Analysis
                <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <p className="text-gray-400 text-sm mt-4">
              No credit card required • Results in under 30 seconds
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
