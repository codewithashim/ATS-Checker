import { SignupForm } from '../components/signup-form';
import { TrendingUp, Target, Award, Users, Shield, Zap } from 'lucide-react';

export function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg-secondary via-white to-brand-bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ecfeff%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Benefits Section */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-secondary to-brand-secondary-light rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Join ATS Checker Pro</h1>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Start Your Journey to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">
                  {' '}Career Success
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of professionals who have optimized their resumes and landed their dream jobs with our AI-powered platform.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">3x More Interviews</h3>
                  <p className="text-gray-600 text-sm">Our users report 3x more interview calls after optimizing their resumes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Targeted Optimization</h3>
                  <p className="text-gray-600 text-sm">Get personalized suggestions based on your target job and industry</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Industry Recognition</h3>
                  <p className="text-gray-600 text-sm">Trusted by Fortune 500 companies and top recruiters worldwide</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Results</h3>
                  <p className="text-gray-600 text-sm">Get your optimized resume in minutes, not days</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Join 50,000+ professionals</p>
                  <p className="text-xs text-gray-500">Already optimizing their careers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-secondary to-brand-secondary-light rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">ATS Checker Pro</h1>
              </div>
              <p className="text-sm text-gray-600">
                Start optimizing your resume today
              </p>
            </div>
            
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
