import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic would be here
    console.log('Login submitted:', { email, password });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-blue-200">
      
      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px]"
      >
        
        {/* Left Side - Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-800 p-12 flex-col justify-between overflow-hidden">
          {/* Abstract floating shapes */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -10, 5, 0]
            }}
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
                Inspire the Next <br /> Generation
              </h2>
              <p className="text-blue-100/80 text-lg max-w-sm leading-relaxed">
                Connect with mentors, find exclusive opportunities, and give back to your alma mater community.
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
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back</h3>
              <p className="text-gray-500 text-sm">Please enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 block">Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
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

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 group"
              >
                Sign In
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
                Don't have an account yet?{' '}
                <a href="#" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Apply for access
                </a>
              </p>
            </div>

          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
