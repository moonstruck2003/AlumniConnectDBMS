import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { id: 'Student', icon: <GraduationCap className="w-5 h-5" />, color: 'blue' },
    { id: 'Alumni', icon: <User className="w-5 h-5" />, color: 'amber' },
    { id: 'Recruiter', icon: <Briefcase className="w-5 h-5" />, color: 'emerald' },
    { id: 'Admin', icon: <ShieldCheck className="w-5 h-5" />, color: 'rose' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Signup logic would be here
    console.log('Signup submitted:', { name, email, password, confirmPassword, role });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-600/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800/80 rounded-[2.5rem] shadow-2xl flex overflow-hidden min-h-[650px] relative z-10"
      >
        {/* Left Side - Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-900 p-12 flex-col justify-between overflow-hidden">
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
              <div className="w-12 h-12 bg-slate-900/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
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
        <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center bg-slate-900">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="text-center lg:text-left mb-10">
              <h3 className="text-3xl font-bold text-white tracking-tight mb-2">Create Your Account</h3>
              <p className="text-slate-400 text-sm">Fill in your details to join the AlumniConnect platform.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300 block">Select Your Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {roles.map((r) => (
                    <motion.div
                      key={r.id}
                      whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRole(r.id)}
                      className={`cursor-pointer p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group/role ${
                        role === r.id 
                          ? `border-${r.color}-500/50 bg-${r.color}-500/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]` 
                          : 'border-slate-800 bg-transparent hover:border-slate-700'
                      }`}
                    >
                      {role === r.id && (
                        <motion.div 
                          layoutId="role-bg"
                          className={`absolute inset-0 bg-gradient-to-b from-${r.color}-500/20 to-transparent pointer-events-none`}
                        />
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        role === r.id 
                          ? `bg-${r.color}-500 text-white shadow-lg shadow-${r.color}-500/40 scale-110` 
                          : 'bg-slate-800 text-slate-500 group-hover/role:bg-slate-700'
                      }`}>
                        {r.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
                        role === r.id ? `text-${r.color}-400` : 'text-slate-600'
                      }`}>
                        {r.id}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Input Fields Container */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-slate-950 transition-all duration-300 outline-none text-sm"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                </div>
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-slate-950 transition-all duration-300 outline-none text-sm"
                      placeholder="you@university.edu"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-slate-950 transition-all duration-300 outline-none text-sm font-mono"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Confirm</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-slate-950 transition-all duration-300 outline-none text-sm font-mono"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Signup Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-black/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 group"
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
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
