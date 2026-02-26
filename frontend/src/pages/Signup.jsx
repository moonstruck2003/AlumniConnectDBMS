import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Signup logic would be here
    console.log('Signup submitted:', { name, email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-blue-200">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px]"
      >
        {/* Left Side - Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-800 p-12 flex-col justify-between overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -10, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-3 text-white"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-teal-300" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90">AlumniConnect</span>
            </motion.div>
          </div>
          <div className="relative z-10 mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                Join the Alumni <br /> Community
              </h2>
              <p className="text-blue-100/80 text-lg max-w-sm leading-relaxed">
                Sign up to connect, mentor, and grow with your alma mater's network.
              </p>
            </motion.div>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="text-center lg:text-left mb-10">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create Your Account</h3>
              <p className="text-gray-500 text-sm">Fill in your details to join the AlumniConnect platform.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all duration-200 outline-none sm:text-sm"
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all duration-200 outline-none sm:text-sm"
                    placeholder="you@university.edu"
                    required
                  />
                </div>
              </div>
              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all duration-200 outline-none sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all duration-200 outline-none sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {/* Signup Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 group"
              >
                Sign Up
                <motion.div
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
