import { motion } from 'framer-motion';

export default function Welcome() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-8 sm:p-14 mb-10 shadow-2xl"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2, duration: 0.5 }}
           className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs font-semibold tracking-wide mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Dashboard Active
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4"
        >
          Welcome Back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">Alex</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg text-slate-400 max-w-xl leading-relaxed"
        >
          Your network is steadily growing. Discover new mentorship opportunities, explore exclusive job postings, and RSVP to upcoming events curated just for you.
        </motion.p>
      </div>
    </motion.div>
  );
}
