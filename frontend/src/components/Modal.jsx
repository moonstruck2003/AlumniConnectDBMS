import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, type = 'info', size = 'lg' }) => {
  const icons = {
    info: <Info className="text-blue-400" size={24} />,
    success: <CheckCircle className="text-emerald-400" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
    error: <X className="text-red-500" size={24} />,
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`w-full ${sizeClasses[size] || sizeClasses.lg} bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group`}
          >
            {/* Inner Glow Polish */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-blue-500/30 transition-colors">
                  {icons[type]}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none italic">{title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 transform active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 relative z-10">
              <div className="text-slate-300 font-medium leading-relaxed italic tracking-tight">
                {children}
              </div>
            </div>

            {/* Background Glows */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-1000" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
