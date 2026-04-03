import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, type = 'info' }) => {
  const icons = {
    info: <Info className="text-blue-400" size={24} />,
    success: <CheckCircle className="text-emerald-400" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
    error: <X className="text-red-500" size={24} />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center shadow-inner">
                  {icons[type]}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 transform active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10">
              <div className="text-slate-300 font-medium leading-relaxed italic tracking-tight">
                {children}
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all duration-1000" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
