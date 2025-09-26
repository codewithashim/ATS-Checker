"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  CpuChipIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: CpuChipIcon,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze your resume content, structure, and formatting for optimal ATS compatibility.",
    gradient: "from-indigo-500 to-cyan-500",
    bgGradient: "from-indigo-50 to-cyan-50"
  },
  {
    icon: ChartBarIcon,
    title: "Detailed Scoring",
    description: "Get comprehensive compatibility scores with detailed breakdowns and data-driven improvement recommendations.",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Keyword Optimization",
    description: "Identify missing keywords and get intelligent suggestions to perfectly match job requirements.",
    gradient: "from-violet-500 to-indigo-500",
    bgGradient: "from-violet-50 to-indigo-50"
  },
  {
    icon: BoltIcon,
    title: "Lightning Fast",
    description: "Get your analysis results in seconds, not hours. Quick turnaround for immediate improvements.",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50"
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Private",
    description: "Your documents are processed securely with enterprise-grade encryption and deleted immediately after analysis.",
    gradient: "from-indigo-600 to-indigo-500",
    bgGradient: "from-indigo-50 to-indigo-50"
  },
  {
    icon: DocumentDuplicateIcon,
    title: "Multiple Formats",
    description: "Support for PDF and DOCX formats. Works seamlessly with all major resume layouts and designs.",
    gradient: "from-cyan-500 to-teal-500",
    bgGradient: "from-cyan-50 to-teal-50"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 opacity-20" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-br from-indigo-100/50 to-cyan-100/50 blur-3xl rounded-full" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-700 border-indigo-200">
            ✨ Powerful Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-cyan-900 bg-clip-text text-transparent">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Optimize Your Resume
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform analyzes your resume against job descriptions 
            to maximize your chances of getting through ATS filters and landing interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="relative border-0 bg-white/70 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-500 h-full overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <CardHeader className="relative text-center p-8">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <CardTitle className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                {/* Hover effect decoration */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-full border border-indigo-200/50 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by 50,000+ job seekers worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
