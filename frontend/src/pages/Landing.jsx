import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { ArrowRight, BookOpen, Users, Briefcase, GraduationCap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-teal-900/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 sticky top-0 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen className="w-5 h-5 text-slate-50" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">AlumniConnect</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <Link to="/alumni" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Directory</Link>
            <Link 
              to="/login" 
              className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-5 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              The Network that Empowers
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-6xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-300 to-slate-600 mb-8"
            >
              Your Alma Mater.<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300">
                Reimagined.
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl lg:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with fellow graduates, find exclusive opportunities, and mentor the next generation of leaders.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold bg-slate-100 hover:bg-white text-slate-900 rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transform hover:-translate-y-1"
              >
                Join the Network
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded-full transition-all transform hover:-translate-y-1"
              >
                Sign In to Account
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Users, title: "Global Directory", desc: "Find and connect with alumni anywhere in the world." },
              { icon: Briefcase, title: "Career Board", desc: "Exclusive jobs and internships posted by alumni." },
              { icon: GraduationCap, title: "Mentorship", desc: "Guide students or find a mentor in your industry." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
                <feature.icon className="w-10 h-10 text-amber-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

    </div>
  );
}
