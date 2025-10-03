"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  DocumentArrowUpIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
  ClockIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

const steps = [
  {
    number: "01",
    icon: DocumentArrowUpIcon,
    title: "Smart Upload & Parse",
    subtitle: "Intelligent Document Processing",
    description: "Drag & drop your resume and paste the job description. Our AI instantly extracts key information, identifies document structure, and prepares for deep analysis.",
    features: ["PDF & DOCX Support", "Instant Parsing", "Secure Processing", "Format Detection"],
    gradient: "from-indigo-600 to-cyan-600",
    bgGradient: "from-indigo-50 to-cyan-50",
    accentColor: "indigo",
    delay: 0.2,
    processingTime: "< 2 seconds"
  },
  {
    number: "02", 
    icon: CpuChipIcon,
    title: "AI-Powered Analysis",
    subtitle: "Advanced Machine Learning",
    description: "Our proprietary AI engine performs multi-layered analysis including keyword matching, semantic understanding, and ATS compatibility scoring using enterprise-grade algorithms.",
    features: ["Semantic Analysis", "Keyword Matching", "ATS Simulation", "Industry Benchmarks"],
    gradient: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    accentColor: "emerald",
    delay: 0.4,
    processingTime: "15-30 seconds"
  },
  {
    number: "03",
    icon: PresentationChartLineIcon,
    title: "Actionable Insights",
    subtitle: "Professional Recommendations",
    description: "Get detailed scoring, personalized recommendations, and step-by-step improvement strategies. Export your optimized resume with confidence.",
    features: ["Detailed Scoring", "Improvement Tips", "Export Options", "Progress Tracking"],
    gradient: "from-violet-600 to-indigo-600",
    bgGradient: "from-violet-50 to-indigo-50",
    accentColor: "violet",
    delay: 0.6,
    processingTime: "Instant results"
  }
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 relative overflow-hidden">
      {/* Ultra-Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Smart Grid Pattern with Enhanced Opacity */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:32px_32px] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#3b82f6_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#8b5cf6_0%,transparent_50%)] opacity-5" />
        
        {/* Smart Floating Particles */}
        <motion.div
          className="absolute top-16 right-16 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-16 left-16 w-32 h-32 bg-gradient-to-br from-violet-400/25 to-indigo-400/25 rounded-full blur-xl"
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1.1],
            x: [0, -15, 5, 0],
            y: [0, 10, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Smart Neural Network Pattern */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-64 h-64"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/10 to-transparent rounded-full blur-sm" />
          <div className="absolute inset-4 bg-gradient-to-r from-transparent via-indigo-200/10 to-transparent rounded-full blur-sm" />
          <div className="absolute inset-8 bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent rounded-full blur-sm" />
        </motion.div>

        {/* Smart Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-indigo-200/30 rounded-lg"
          animate={{
            rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full"
          animate={{
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Smart Data Flow Lines */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-0 w-full h-px bg-gradient-to-l from-transparent via-indigo-300/20 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 3
          }}
        />

        {/* Smart Energy Orbs */}
        <motion.div
          className="absolute top-1/5 left-1/5 w-80 h-80 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-purple-100/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute bottom-1/5 right-1/5 w-72 h-72 bg-gradient-to-r from-emerald-100/20 via-cyan-100/20 to-blue-100/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-700 border-indigo-200 text-sm font-semibold">
              <SparklesIcon className="w-4 h-4 mr-2" />
              How It Works
              <LightBulbIcon className="w-4 h-4 ml-2" />
            </Badge>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Smart
            </span>
            <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {" "}3-Step{" "}
            </span>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Experience the future of resume optimization with our intelligent, 
            production-ready AI platform that delivers professional results in seconds.
          </p>

          {/* Process Timeline Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="w-4 h-4" />
              Total Time: 2-5 minutes
            </div>
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckIcon className="w-4 h-4 text-green-500" />
              99.7% Success Rate
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Step Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: step.delay }}
              onHoverStart={() => setActiveStep(index)}
              className="relative group"
            >
              {/* Enhanced Connection Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: step.delay + 0.3 }}
                  className="hidden lg:block absolute top-20 left-full w-full h-0.5 z-10"
                >
                  <div className="h-full bg-gradient-to-r from-indigo-200 via-cyan-200 to-transparent rounded-full" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={activeStep >= index ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              )}

              {/* Modern Step Card */}
              <motion.div 
                whileHover={{ y: -12, scale: 1.02 }}
                className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-indigo-200"
                style={{
                  background: `linear-gradient(135deg, white 0%, ${step.bgGradient.includes('indigo') ? '#fafbff' : step.bgGradient.includes('emerald') ? '#f0fdf9' : '#faf8ff'} 100%)`
                }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                    {step.number}
                  </span>
                </div>

                {/* Processing Time Indicator */}
                <div className="absolute -top-2 right-4 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <ClockIcon className="w-3 h-3" />
                    {step.processingTime}
                  </div>
                </div>

                {/* Icon Container */}
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-500 relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <step.icon className="w-10 h-10 text-white relative z-10" />
                </motion.div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mb-4">
                    {step.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: step.delay + 0.1 + featureIndex * 0.1 }}
                      className="flex items-center gap-2 text-xs text-gray-600"
                    >
                      <CheckIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-3xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${step.gradient}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: step.delay + 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <div className="relative bg-gradient-to-br from-indigo-600 via-cyan-600 to-violet-600 rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[size:30px_30px] bg-[image:radial-gradient(circle_at_center,white_1px,transparent_1px)] opacity-[0.05]" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Join 50,000+ professionals who have optimized their resumes and landed their dream jobs with our AI-powered platform.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  size="lg" 
                  className="group relative text-xl px-12 py-6 h-auto bg-white text-indigo-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl border-0 rounded-2xl font-semibold overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <SparklesIcon className="w-6 h-6 mr-3" />
                  Start Free Analysis
                  <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <div className="mt-8 flex items-center justify-center gap-8 text-indigo-100 text-sm">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Results in under 30 seconds
                </div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Enterprise-grade security
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
